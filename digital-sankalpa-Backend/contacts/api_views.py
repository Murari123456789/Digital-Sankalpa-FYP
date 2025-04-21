import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact_email(request):
    try:
        # Log the incoming request data
        logger.info(f"Received contact form data: {request.data}")

        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        if not all([name, email, subject, message]):
            missing = [field for field, value in {
                'name': name, 'email': email,
                'subject': subject, 'message': message
            }.items() if not value]
            return Response(
                {'error': f'Missing required fields: {", ".join(missing)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Log email settings
        logger.info(f"Using email settings - HOST_USER: {settings.EMAIL_HOST_USER}")
        
        # Construct email message
        email_subject = f"Contact Form: {subject}"
        email_message = f"""
New contact form submission from Digital Sankalpa:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
"""
        
        try:
            # Send email with better error handling
            from django.core.mail import EmailMessage
            email = EmailMessage(
                subject=email_subject,
                body=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.EMAIL_HOST_USER],
                reply_to=[email],
            )
            email.send(fail_silently=False)
            
            logger.info(f"Email sent successfully from {email} to {settings.EMAIL_HOST_USER}")
            
            return Response({
                'message': 'Thank you for your message. We will get back to you soon!'
            }, status=status.HTTP_200_OK)
            
        except BadHeaderError:
            logger.error("Invalid header found in email")
            return Response(
                {'error': 'Invalid header found.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return Response(
                {'error': f'Failed to send email: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        logger.error(f"Unexpected error in send_contact_email: {str(e)}")
        return Response(
            {'error': 'An unexpected error occurred. Please try again later.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
