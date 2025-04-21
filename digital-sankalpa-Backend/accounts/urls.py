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
]