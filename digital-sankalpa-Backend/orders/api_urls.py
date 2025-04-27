from django.urls import path
from .api_views import *

urlpatterns = [
    path('view-orders/', view_orders, name='view_orders'),
    path('view-cart/', view_cart, name='view_cart'),
    path('add-to-cart/<int:product_id>/', add_to_cart, name='add_to_cart'),
    path('update-cart-item/<int:cart_item_id>/', update_cart_item, name='update_cart_item'),
    path('remove-from-cart/<int:cart_item_id>/', remove_from_cart, name='remove_from_cart'),
    path('checkout/', checkout, name='checkout'),
    path('checkout/success/<int:order_id>', checkout_success, name='success'),
    path('checkout/failure/<int:order_id>', checkout_failure, name='failure'),
    path('order/<int:order_id>/', get_order_by_id, name='get_order_by_id'),
]