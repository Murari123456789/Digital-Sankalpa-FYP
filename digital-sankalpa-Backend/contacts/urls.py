from django.urls import path
from . import api_views

urlpatterns = [
    path('send-message/', api_views.send_contact_email, name='send_contact_email'),
]
