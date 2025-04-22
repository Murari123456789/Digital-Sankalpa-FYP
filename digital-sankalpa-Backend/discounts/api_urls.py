from django.urls import path
from . import views

urlpatterns = [
    path('validate-promo/', views.validate_promo_code, name='validate-promo'),
    path('apply-promo/', views.apply_promo_code, name='apply-promo'),
]