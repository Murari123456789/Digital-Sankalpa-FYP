from .models import CartItem

def cart_context(request):
    if request.user.is_authenticated:
        cart_items_count = 0
        cart_items = CartItem.objects.filter(user=request.user, active=True)
        for cart_item in cart_items:
            cart_items_count += cart_item.quantity
        return {'cart_items_count': cart_items_count}
    return {}