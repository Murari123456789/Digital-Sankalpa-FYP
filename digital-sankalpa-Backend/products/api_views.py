from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from .models import Product, Wishlist, Review
from .serializers import ProductSerializer, WishlistSerializer, ReviewSerializer

@api_view(['GET'])
def product_list(request):
    # Start with all products
    products = Product.objects.all()

    # Apply search query filter
    query = request.GET.get('query', '')
    if query:
        products = products.filter(name__icontains=query)

    # Apply category filter
    categories = request.GET.get('categories', '')
    if categories:
        category_list = categories.split(',')
        products = products.filter(category__in=category_list)

    # Apply price range filter
    min_price = request.GET.get('min_price')
    if min_price:
        products = products.filter(price__gte=float(min_price))

    max_price = request.GET.get('max_price')
    if max_price:
        products = products.filter(price__lte=float(max_price))

    # Apply sorting
    sort = request.GET.get('sort', 'newest')
    if sort == 'newest':
        products = products.order_by('-created_at')
    elif sort == 'price_low':
        products = products.order_by('price')
    elif sort == 'price_high':
        products = products.order_by('-price')
    elif sort == 'popular':
        # You might want to implement a more sophisticated popularity metric
        products = products.order_by('-created_at')

    # Pagination: Show 9 products per page
    paginator = Paginator(products, 9)
    page_number = request.GET.get('page', 1)
    try:
        paginated_products = paginator.page(page_number)
    except:
        paginated_products = paginator.page(1)

    # Serialize the products
    serializer = ProductSerializer(paginated_products, many=True)

    return Response({
        'products': serializer.data,
        'total_pages': paginator.num_pages,
        'current_page': int(page_number),
        'total_products': paginator.count,
        'has_next': paginated_products.has_next(),
        'has_previous': paginated_products.has_previous()
    })

    serializer = ProductSerializer(paginated_products, many=True)
    return Response({
        'products': serializer.data,
        'page': paginated_products.number,
        'total_pages': paginator.num_pages
    })

@api_view(['GET', 'POST'])
def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if user has already reviewed this product
        if Review.objects.filter(user=request.user, product=product).exists():
            return Response({'error': 'You have already reviewed this product'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        rating = request.data.get('rating')
        comment = request.data.get('comment', '').strip()

        if not rating or not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
            return Response({'error': 'Rating must be between 1 and 5'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        if not comment:
            return Response({'error': 'Comment is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            user=request.user,
            product=product,
            rating=rating,
            comment=comment
        )
        
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    has_bought = request.user.is_authenticated and request.user.orders.filter(cart_items__product_id=product_id).exists()
    
    # Get related products (products in the same category, excluding current product)
    related_products = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
    
    # Check if product is in user's wishlist
    is_in_wishlist = False
    if request.user.is_authenticated:
        is_in_wishlist = Wishlist.objects.filter(user=request.user, product=product).exists()

    # Get user's review if it exists
    user_review = None
    if request.user.is_authenticated:
        try:
            user_review = Review.objects.get(user=request.user, product=product)
        except Review.DoesNotExist:
            pass

    return Response({
        'product': ProductSerializer(product).data,
        'has_bought': has_bought,
        'related_products': ProductSerializer(related_products, many=True).data,
        'is_in_wishlist': is_in_wishlist,
        'user_review': ReviewSerializer(user_review).data if user_review else None
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlist_list(request):
    wishlist_items = Wishlist.objects.filter(user=request.user)
    serializer = WishlistSerializer(wishlist_items, many=True)
    return Response(serializer.data)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def review_detail(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    
    # Only allow users to delete their own reviews
    if request.method == 'DELETE':
        if review.user != request.user:
            return Response({'error': 'You can only delete your own reviews'}, 
                          status=status.HTTP_403_FORBIDDEN)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    return Response(ReviewSerializer(review).data)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def wishlist_toggle(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        # Add to wishlist
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user,
            product=product
        )
        if created:
            return Response({'message': 'Added to wishlist'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Already in wishlist'}, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        # Remove from wishlist
        try:
            wishlist_item = Wishlist.objects.get(user=request.user, product=product)
            wishlist_item.delete()
            return Response({'message': 'Removed from wishlist'}, status=status.HTTP_200_OK)
        except Wishlist.DoesNotExist:
            return Response({'message': 'Item not in wishlist'}, status=status.HTTP_404_NOT_FOUND)
