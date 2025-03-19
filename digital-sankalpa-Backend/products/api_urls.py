from django.urls import path
from .api_views import *

urlpatterns = [
    path('', product_list, name='api_home'),
    path('product/<int:product_id>/', product_detail, name='api_product_detail'),
]