from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from .serializers import OrderSerializer
from products.models import Product
import uuid
from discounts.models import Discount
from django.utils import timezone

from rest_framework.pagination import PageNumberPagination
from django.core.cache import cache
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

class OrderPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_orders(request):
    # Try to get from cache first
    cache_key = f'user_orders_{request.user.id}'
    cached_orders = cache.get(cache_key)

    if cached_orders is None:
        # If not in cache, get from database
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        cached_orders = serializer.data
        # Cache for 5 minutes
        cache.set(cache_key, cached_orders, timeout=300)

    # Apply pagination
    paginator = OrderPagination()
    paginated_orders = paginator.paginate_queryset(cached_orders, request)
    
    return paginator.get_paginated_response(paginated_orders)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from orders.models import CartItem
from .serializers import CartItemSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    cart_items = CartItem.objects.filter(user=request.user, active=True)
    serializer = CartItemSerializer(cart_items, many=True)
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    return Response({
        'cart_items': serializer.data,
        'total_price': total_price
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if product is in stock
    if product.stock <= 0:
        return Response({'error': 'This product is out of stock'}, status=status.HTTP_400_BAD_REQUEST)

    # Get existing cart item or create new one
    cart_item, created = CartItem.objects.get_or_create(
        user=request.user,
        product=product,
        active=True  # Only get active cart items
    )

    # Calculate new quantity
    new_quantity = 1 if created else cart_item.quantity + 1

    # Check if we have enough stock
    if new_quantity > product.stock:
        return Response({'error': 'Not enough stock available'}, status=status.HTTP_400_BAD_REQUEST)

    # Update cart item
    cart_item.quantity = new_quantity
    cart_item.save()

    return Response({
        'message': f'Added {product.name} to your cart.',
        'cart_item': CartItemSerializer(cart_item).data
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, cart_item_id):
    try:
        cart_item = CartItem.objects.get(id=cart_item_id, user=request.user)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    quantity = int(request.data.get('quantity'))
    if quantity >= 1:
        if quantity > cart_item.product.stock:
            return Response({'error': 'Not enough stock!'}, status=status.HTTP_400_BAD_REQUEST)
        cart_item.quantity = quantity
        cart_item.save()
        return Response({'message': 'Cart updated successfully!'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, cart_item_id):
    try:
        cart_item = CartItem.objects.get(id=cart_item_id, user=request.user)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    cart_item.delete()
    return Response({'message': 'Item removed from your cart!'}, status=status.HTTP_200_OK)
from esewa.payment import EsewaPayment

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    # Get the user's cart items
    cart_items = CartItem.objects.filter(user=request.user, active=True)
    if not cart_items:
        return Response({'error': 'Your cart is empty!'}, status=status.HTTP_400_BAD_REQUEST)

    # Calculate the total price of items in the cart
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    
    # Handle point redemption
    points_redeemed = request.data.get('points_redeemed', 0)
    point_discount = 0
    
    if points_redeemed:
        # Validate points
        if points_redeemed > request.user.points:
            return Response({'error': 'Not enough points available'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate point discount (10 points = 1 Rs)
        point_discount = points_redeemed / 10
        
        # Ensure point discount doesn't exceed total price
        if point_discount > total_price:
            return Response({'error': 'Point discount cannot exceed total price'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if there's any active discount for the user
    discount = Discount.objects.filter(user=request.user, valid_until__gte=timezone.now()).last()
    if discount:
        # Apply percentage discount first
        final_price = float(total_price) - (float(total_price) * float(discount.discount_percentage) / 100)
        # Then apply point discount
        final_price = max(0, final_price - point_discount)
    else:
        final_price = max(0, float(total_price) - point_discount)
        discount_percentage = 0  # No discount
     
    # Create a unique order ID using uuid
    uid = uuid.uuid4().hex[:8]
    
    # Create the order object
    order = Order.objects.create(
        user=request.user,
        uuid=uid,
        total_price=total_price,
        discount=discount.discount_percentage if discount else 0,
        points_redeemed=points_redeemed,
        point_discount=point_discount,
        final_price=final_price,
        payment_status="pending"
    )
    
    # Deduct points from user's account
    if points_redeemed:
        request.user.points -= points_redeemed
        request.user.save()

    # Associate the cart items with the order
    order.cart_items.set(cart_items)

    # Setup the payment system (Esewa in this case)
    payment = EsewaPayment(
        success_url=f"http://localhost:3000/order-success/{order.id}",
        failure_url=f"http://localhost:3000/checkout/{order.id}"
    )
    
    # Generate the payment signature for Esewa
    payment.create_signature(final_price, uid)

    # Prepare the form for payment processing (if needed, you can return it as part of the response)
    payment_form = payment.generate_form()

    # Return the response with order and payment details
    return Response({
        'message': f'Order placed successfully! Total: ${final_price}',
        'order': OrderSerializer(order).data,
        'payment_form': payment_form,  # You may include the form or payment link as needed
    }, status=status.HTTP_201_CREATED)
from esewa.signature import verify_signature

@api_view(['GET'])
def checkout_success(request, order_id):
    # Verify the payment signature using Esewa's response data
    if not verify_signature(request.GET.get('data')):
        return Response({'error': 'Invalid payment!'}, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve the order and mark it as completed
    order = Order.objects.get(id=order_id)
    order.payment_status = "completed"

    # Update stock and deactivate cart items
    cart_items = order.cart_items.all()
    for item in cart_items:
        # Update product stock
        product = item.product
        product.stock -= item.quantity
        product.save()
        
        # Deactivate cart item
        item.active = False
        item.save()

    order.save()

    # Award points to user (10 points per 100 spent)
    points_to_award = int(float(order.total_price) // 100 * 10)
    user = order.user
    user.points += points_to_award
    user.save()

    return Response({
        'message': 'Payment successful! Order processed.',
        'points_earned': points_to_award,
        'total_points': user.points
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def checkout_failure(request, order_id):
    # Retrieve the most recent order of the user
    order = Order.objects.filter(user=request.user).last()
    if order:
        order.delete()  # Delete the order on payment failure
    return Response({'error': 'Payment failed! Your order was cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
