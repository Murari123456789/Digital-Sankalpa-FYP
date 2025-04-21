from django.urls import path
from .api_views import (
    product_list,
    product_detail,
    wishlist_list,
    wishlist_toggle,
    review_detail
)

urlpatterns = [
    path('', product_list, name='product_list'),
    path('<int:product_id>/', product_detail, name='product_detail'),
    path('wishlist/', wishlist_list, name='wishlist_list'),
    path('wishlist/<int:product_id>/', wishlist_toggle, name='wishlist_toggle'),
    path('reviews/<int:review_id>/', review_detail, name='review_detail'),
]