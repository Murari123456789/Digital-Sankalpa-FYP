import os
import sys
import django
import traceback

# Set up Django environment
sys.path.append('/Users/muraripathak/Desktop/Digital-Sankalpa-FYP/digital-sankalpa-Backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DS.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("Email settings:")
print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")

try:
    print("\nAttempting to send test email...")
    result = send_mail(
        subject='Test Email from Digital Sankalpa',
        message='This is a test email to debug the email sending functionality.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=['murari.pathak@gmail.com'],
        fail_silently=False,
    )
    print(f"Email send result: {result}")
    print("Email sent successfully!")
except Exception as e:
    print(f"Error sending email: {str(e)}")
    print("Traceback:")
    traceback.print_exc()
