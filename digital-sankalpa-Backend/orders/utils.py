from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from decimal import Decimal

def send_order_receipt(order):
    """
    Send an order receipt email to the customer
    
    Args:
        order: The Order object containing all order details
    """
    # Get user email
    user_email = order.user.email
    
    # Calculate discount amounts
    user_discount_amount = Decimal('0.00')
    if order.discount > 0:
        user_discount_amount = (order.total_price * order.discount / 100)
    
    promo_discount_amount = Decimal('0.00')
    if order.used_discount:
        promo_discount_amount = (order.total_price * order.used_discount.discount_percentage / 100)
    
    # Format currency values
    for item in order.cart_items.all():
        item.price_display = f"Rs. {item.product.price}"
        item.total_display = f"Rs. {item.product.price * item.quantity}"
    
    # Context for the email template
    context = {
        'order': order,
        'cart_items': order.cart_items.all(),
        'user_discount_amount': f"Rs. {user_discount_amount:.2f}",
        'promo_discount_amount': f"Rs. {promo_discount_amount:.2f}",
        'point_discount': f"Rs. {order.point_discount}",
        'total_price': f"Rs. {order.total_price}",
        'final_price': f"Rs. {order.final_price}",
        'points_redeemed': order.points_redeemed,
        'shipping_address': order.shipping_address,
        'payment_method': order.payment_method.capitalize(),
        'order_date': order.created_at.strftime("%B %d, %Y"),
    }
    
    # Render email templates
    html_message = render_to_string('emails/order_receipt.html', context)
    plain_message = strip_tags(html_message)
    
    # Send email
    send_mail(
        subject=f'Your Digital Sankalpa Order #{order.uuid} Receipt',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
        fail_silently=False,
    )
    
    return True
