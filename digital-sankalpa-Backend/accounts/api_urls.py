from django.urls import path
from .api_views import *

urlpatterns = [
    path("register/", register_view, name="api_register"),
    path("login/", login_view, name="api_login"),
    path("logout/", logout_view, name="api_logout"),
    path("contact/", contact, name="api_contact"),
    path('admin_dash/', admin_dash, name='api_admin_dashboard'),
    path('my/account/',my_account, name='api_my_account'),
    path('change_password/', change_password, name='api_change_password'),
]