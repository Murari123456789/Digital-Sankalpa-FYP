"""
URL configuration for DS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.contrib.auth import get_user_model
from orders.models import Order
from products.models import Product
from discounts.models import Discount, PromoCode

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'accounts': {
            'register': request.build_absolute_uri('/api/accounts/register/'),
            'login': request.build_absolute_uri('/api/accounts/login/'),
            'profile': request.build_absolute_uri('/api/accounts/profile/'),
        },
        'products': request.build_absolute_uri('/api/products/'),
        'orders': request.build_absolute_uri('/api/orders/'),
        'reviews': request.build_absolute_uri('/api/reviews/'),
        'discounts': request.build_absolute_uri('/api/discounts/'),
        'contact': request.build_absolute_uri('/api/contact/'),
    })

# Save the original index view
original_index = admin.site.index

def custom_index(request, extra_context=None):
    User = get_user_model()
    extra_context = extra_context or {}
    extra_context['user_count'] = User.objects.count()
    extra_context['order_count'] = Order.objects.count()
    extra_context['product_count'] = Product.objects.count()
    extra_context['discount_count'] = Discount.objects.count()
    extra_context['promocode_count'] = PromoCode.objects.count()
    return original_index(request, extra_context)

admin.site.index = custom_index

urlpatterns = [
        path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('accounts.api_urls')),
    path('api/products/', include('products.api_urls')),
    path('api/orders/', include('orders.api_urls')),
    path('api/reviews/', include('reviews.api_urls')),
    path('api/discounts/', include('discounts.api_urls')),
    path('api/contact/', include('contacts.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
