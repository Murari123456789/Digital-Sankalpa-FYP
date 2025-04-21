from django.urls import path
from . import api_views

urlpatterns = [
    path("register/", api_views.register_view, name="register"),
    path("login/", api_views.login_view, name="login"),
    path("logout/", api_views.logout_view, name="logout"),
    path("contact/", api_views.contact, name="contact"),
    path('admin_dash/', api_views.admin_dash, name='admin_dashboard'),
    path('my/account/', api_views.my_account, name='my_account'),
    path('change_password/', api_views.change_password, name='change_password'),
    
    # Forgot password endpoints
    path('forgot-password/send-otp/', api_views.send_otp, name='forgot_password_send_otp'),
    path('forgot-password/verify-otp/', api_views.verify_otp, name='forgot_password_verify_otp'),
    path('forgot-password/reset-password/', api_views.reset_password, name='forgot_password_reset'),
]