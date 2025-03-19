from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accounts/', include('accounts.api_urls')),
    path('products/', include('products.api_urls')),
    path('orders/', include('orders.api_urls')),
    path('reviews/', include('reviews.api_urls')),
    path('discounts/', include('discounts.api_urls')),
    
]