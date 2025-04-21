from django.urls import path
from .api_views import (
    register_view,
    login_view,
    logout_view,
    user_profile,
    update_profile,
    change_password,
    admin_dash,
    contact,
    claim_login_streak_reward,
    claim_ink_bottle_points
)

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', user_profile, name='profile'),
    path('profile/update/', update_profile, name='update_profile'),
    path('profile/change-password/', change_password, name='change_password'),
    path('admin/dashboard/', admin_dash, name='admin_dashboard'),
    path('contact/', contact, name='contact'),
    path('rewards/login-streak/', claim_login_streak_reward, name='claim_login_streak_reward'),
    path('rewards/ink-bottles/', claim_ink_bottle_points, name='claim_ink_bottle_points'),
]