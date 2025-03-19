from django.urls import path
from .views import *

urlpatterns = [
    # path('', all_products, name='home'),
    path('', product_list, name='home'),
    path('product/<int:product_id>/', product_detail, name='product_detail'),
]