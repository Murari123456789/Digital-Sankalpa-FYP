from django.urls import path
from . import views, api_views

urlpatterns = [
    # Promo code endpoints
    path('promocodes/', views.list_promocodes, name='list-promocodes'),
    path('promocodes/validate/', views.validate_promo_code, name='validate-promo'),
    path('promocodes/apply/', views.apply_promo_code, name='apply-promo'),
    
    # User discount endpoints
    path('discounts/create/', api_views.create_user_discount, name='create-user-discount'),
    path('discounts/user/', api_views.get_user_discounts, name='get-user-discounts'),
    path('discounts/all/', api_views.list_all_discounts, name='list-all-discounts'),
    path('discounts/<int:discount_id>/', api_views.delete_discount, name='delete-discount'),
]