from django.urls import path
from .views import *

urlpatterns = [
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("contact/", contact, name="contact"),
    path('admin_dash/', admin_dash, name='admin_dashboard'),
    path('my/account/',my_account, name='my_account'),
    path('change_password/', change_password, name='change_password'),
]