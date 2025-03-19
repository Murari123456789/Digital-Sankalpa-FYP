from django.shortcuts import render, redirect
from django.contrib import messages
from .models import CartItem,Order
from products.models import Product 
from django.contrib.auth.decorators import login_required
from discounts.models import Discount

@login_required
def view_orders(request):
    orders = Order.objects.filter(user=request.user)
    context = {
        'orders': orders
    }
    return render(request, 'orders/orders.html', context)


@login_required
def add_to_cart(request, product_id):
    product = Product.objects.get(id=product_id)
    cart_item, created = CartItem.objects.get_or_create(
        user=request.user, product=product
    )
    if not created:
        cart_item.quantity += 1
        cart_item.save()
        messages.success(request, f'Added 1 more {product.name} to your cart.')
    else:
        cart_item.quantity = 1
        cart_item.save()
        messages.success(request, f'Added {product.name} to your cart.')

    return redirect(request.META.get('HTTP_REFERER')) 

@login_required
def view_cart(request):
    cart_items = CartItem.objects.filter(user=request.user, active=True)
    for item in cart_items:
        if item.quantity > item.product.stock:
            item.quantity = item.product.stock
            item.save()
            messages.error(request, f'Quantity of {item.product.name} has been updated as per stock availability.', extra_tags='warning')
        item.total = item.product.price * item.quantity
    total_price = sum(item.product.price * item.quantity for item in cart_items)

    return render(request, 'orders/view_cart.html', {'cart_items': cart_items, 'total_price': total_price})


@login_required
def update_cart_item(request, cart_item_id):
    cart_item = CartItem.objects.get(id=cart_item_id, user=request.user)
    
    if request.method == 'POST':
        quantity = int(request.POST.get('quantity'))
        if quantity >= 1:
            cart_item.quantity = quantity
            cart_item.save()
            messages.success(request, 'Cart updated successfully!')
        else:
            messages.error(request, 'Quantity must be at least 1.', extra_tags='danger')
    
    return redirect('view_cart')


@login_required
def remove_from_cart(request, cart_item_id):
    cart_item = CartItem.objects.get(id=cart_item_id, user=request.user)
    cart_item.delete()
    messages.success(request, 'Item removed from your cart!')
    return redirect('view_cart')


from .models import Order
from esewa.payment import EsewaPayment
from esewa.signature import verify_signature
import uuid
from django.utils import timezone
from django.shortcuts import render, redirect

@login_required
def checkout(request):
    cart_items = CartItem.objects.filter(user=request.user)
    if cart_items:
        total_price = sum(item.product.price * item.quantity for item in cart_items)
        discount = Discount.objects.filter(user=request.user, valid_until__gte=timezone.now()).last()
        if discount:
            final_price = float(total_price) - (float(total_price) * float(discount.discount_percentage) / 100)
        else:
            final_price = total_price
            discount.discount_percentage = 0
        uid = uuid.uuid4().hex[:8]
        order = Order.objects.create(
            user=request.user,
            uuid=uid,
            total_price=total_price,
            discount=discount.discount_percentage,
            final_price=final_price,
            payment_status="pending"
        )
        order.cart_items.set(cart_items)
        payment = EsewaPayment(
            success_url=f"http://localhost:8000/orders/checkout/success/{order.id}",
            failure_url=f"http://localhost:8000/orders/checkout/failure{order.id}"
        )
        payment.create_signature(final_price, uid)

        messages.success(request, f'Order placed successfully! Total: ${final_price}')
        return render(request, 'orders/checkout.html', {'order': order,'form':payment.generate_form()})
    else:
        messages.error(request, 'Your cart is empty!', extra_tags='danger')
        return redirect('home')
    

def checkout_success(request, order_id):
    if not verify_signature(request.GET.get('data')):
        messages.error(request, 'Invalid payment!', extra_tags='danger')
        return redirect('home')
    order = Order.objects.get(id=order_id)
    order.payment_status = "completed"
    cart_items = order.cart_items.all()
    for item in cart_items:
        item.product.stock -= item.quantity
        item.active = False
        item.product.save()
        item.save()
    order.save()
    messages.success(request, 'Payment successful!')
    return redirect('home')

def checkout_failure(request, order_id):
    order = Order.objects.filter(user=request.user).last()
    order.delete()
    messages.error(request, 'Payment failed!', extra_tags='danger')
    return redirect('home')
