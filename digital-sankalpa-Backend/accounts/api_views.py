from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
import random
import json
from django.core.cache import cache
from .models import Contact, CustomUser
from .serializers import UserSerializer, ContactSerializer
from products.models import Product
from django.contrib.auth.hashers import make_password
import logging

User = get_user_model()

# Configure logging
logger = logging.getLogger(__name__)

@csrf_exempt
def send_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            logger.info(f'Received forgot password request for email: {email}')
            
            if not email:
                return JsonResponse({'error': 'Email is required'}, status=400)
            
            try:
                # Get all users with this email
                users = User.objects.filter(email=email)
                if not users.exists():
                    logger.warning(f'No user found with email: {email}')
                    return JsonResponse({'error': 'No user found with this email'}, status=404)
                
                # Use the most recently active user if multiple exist
                user = users.order_by('-last_login').first()
                logger.info(f'Found user with email: {email} (username: {user.username})')
                
                otp = str(random.randint(100000, 999999))
                
                # Store OTP and user ID in cache with 10 minutes expiry
                cache_data = {
                    'otp': otp,
                    'user_id': user.id
                }
                cache.set(f'password_reset_otp_{email}', cache_data, timeout=600)
                logger.info(f'Stored OTP in cache for email: {email}')
                
                try:
                    # Print email settings for debugging
                    logger.info(f'Email settings: HOST={settings.EMAIL_HOST}, PORT={settings.EMAIL_PORT}, USER={settings.EMAIL_HOST_USER}')
                    
                    # Send OTP via email
                    send_mail(
                        subject='Password Reset OTP',
                        message=f'Your OTP for password reset is: {otp}\nThis OTP will expire in 10 minutes.',
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[email],
                        fail_silently=False,
                    )
                    logger.info(f'Successfully sent OTP email to: {email}')
                    return JsonResponse({'message': 'OTP sent successfully'}, status=200)
                    
                except Exception as e:
                    logger.error(f'Failed to send email: {str(e)}')
                    return JsonResponse({
                        'error': 'Failed to send email',
                        'details': str(e)
                    }, status=500)
                
            except User.DoesNotExist:
                logger.warning(f'No user found with email: {email}')
                return JsonResponse({'error': 'No user found with this email'}, status=404)
                
        except json.JSONDecodeError as e:
            logger.error(f'Invalid JSON data: {str(e)}')
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f'Unexpected error in send_otp: {str(e)}')
            return JsonResponse({
                'error': 'Server error',
                'details': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def verify_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            otp = data.get('otp')
            
            if not email or not otp:
                return JsonResponse({'error': 'Email and OTP are required'}, status=400)
            
            cache_data = cache.get(f'password_reset_otp_{email}')
            logger.info(f'Retrieved cache data for email {email}: {cache_data}')
            
            if not cache_data:
                return JsonResponse({'error': 'OTP has expired. Please request a new one.'}, status=400)
            
            if cache_data['otp'] == otp:
                # Generate a temporary token for password reset
                temp_token = str(random.randint(100000, 999999))
                # Store token with user ID
                cache.set(f'password_reset_token_{email}', {
                    'token': temp_token,
                    'user_id': cache_data['user_id']
                }, timeout=300)
                
                # Clear the OTP from cache
                cache.delete(f'password_reset_otp_{email}')
                logger.info(f'OTP verified for email {email}')
                return JsonResponse({'message': 'OTP verified', 'token': temp_token}, status=200)
            
            logger.warning(f'Invalid OTP attempt for email {email}')
            return JsonResponse({'error': 'Invalid OTP'}, status=400)
            
        except json.JSONDecodeError as e:
            logger.error(f'Invalid JSON data: {str(e)}')
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f'Unexpected error in verify_otp: {str(e)}')
            return JsonResponse({
                'error': 'Server error',
                'details': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            token = data.get('token')
            new_password = data.get('new_password')
            
            if not all([email, token, new_password]):
                return JsonResponse({'error': 'Email, token and new password are required'}, status=400)
            
            cache_data = cache.get(f'password_reset_token_{email}')
            logger.info(f'Retrieved token data for email {email}: {cache_data}')
            
            if not cache_data:
                return JsonResponse({'error': 'Reset token has expired. Please start over.'}, status=400)
            
            if cache_data['token'] == token:
                try:
                    # Get user and print their current state
                    user = User.objects.get(id=cache_data['user_id'])
                    logger.info(f'Found user {user.username} with ID {user.id}')
                    
                    # Set and verify the new password
                    logger.info(f'Setting new password for user {user.username}')
                    from django.contrib.auth.hashers import make_password, check_password
                    
                    # Generate the password hash
                    password_hash = make_password(new_password)
                    
                    # Update password directly in the database
                    from django.db import connection
                    with connection.cursor() as cursor:
                        cursor.execute(
                            'UPDATE accounts_customuser SET password = %s WHERE id = %s',
                            [password_hash, user.id]
                        )
                    
                    # Verify the change in database
                    with connection.cursor() as cursor:
                        cursor.execute(
                            'SELECT password FROM accounts_customuser WHERE id = %s',
                            [user.id]
                        )
                        row = cursor.fetchone()
                        if not row:
                            logger.error('Could not fetch user after password update')
                            return JsonResponse({'error': 'Failed to verify password update'}, status=500)
                        
                        stored_hash = row[0]
                        if not check_password(new_password, stored_hash):
                            logger.error('Password hash verification failed')
                            return JsonResponse({'error': 'Failed to verify new password hash'}, status=500)
                    
                    # Final verification through authentication
                    test_user = authenticate(username=user.username, password=new_password)
                    if not test_user:
                        logger.error(f'Failed to authenticate with new password for user {user.username}')
                        return JsonResponse({'error': 'Failed to verify new password'}, status=500)
                    
                    logger.info('Password successfully updated and verified')
                    
                    # Clear the reset token
                    cache.delete(f'password_reset_token_{email}')
                    logger.info(f'Password reset and verification completed for user {user.username}')
                    
                    return JsonResponse({'message': 'Password reset successful'}, status=200)
                except User.DoesNotExist:
                    logger.error(f'User not found with ID {cache_data["user_id"]}')
                    return JsonResponse({'error': 'User not found'}, status=404)
                except Exception as e:
                    logger.error(f'Failed to reset password: {str(e)}')
                    return JsonResponse({'error': f'Failed to reset password: {str(e)}'}, status=500)
            
            logger.warning(f'Invalid token attempt for email {email}')
            return JsonResponse({'error': 'Invalid reset token'}, status=400)
            
        except json.JSONDecodeError as e:
            logger.error(f'Invalid JSON data: {str(e)}')
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f'Unexpected error in reset_password: {str(e)}')
            return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

from orders.models import Order
from django.db.models import Sum

# **Register User**
@api_view(['POST'])
def register_view(request):
    try:
        logger.info(f'Received registration request with data: {request.data}')
        
        # Create the serializer
        serializer = UserSerializer(data=request.data)
        
        # Validate the data
        try:
            if serializer.is_valid(raise_exception=True):
                # Save the user
                user = serializer.save()
                logger.info(f'Successfully registered user: {user.username}')
                
                # Return success response
                return Response(
                    {
                        "success": True,
                        "message": "Registration successful!",
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email
                        }
                    }, 
                    status=status.HTTP_201_CREATED
                )
        except serializers.ValidationError as e:
            logger.error(f'Validation error: {str(e)}')
            return Response(
                {
                    "success": False,
                    "error": e.detail if hasattr(e, 'detail') else str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f'Error creating user: {str(e)}')
            return Response(
                {
                    "success": False,
                    "error": "An error occurred while creating your account. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        logger.error(f'Unexpected error in register_view: {str(e)}')
        return Response(
            {
                "success": False,
                "error": "An unexpected error occurred. Please try again."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# **Login User and Return JWT Token**
from django.utils import timezone
from datetime import timedelta

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Try to find user by username first
    user = authenticate(username=username, password=password)
    
    # If authentication failed, try email
    if not user:
        try:
            # Get user by email
            user_obj = User.objects.filter(email=username).order_by('-last_login').first()
            if user_obj:
                # Try to authenticate with the found username
                user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass
    
    if user:
        # Check if this login is within 24 hours of the last login
        last_login = user.last_login
        now = timezone.now()
        
        if last_login and (now - last_login) <= timedelta(days=1):
            # Increment login streak if login is within 24 hours
            user.login_streak += 1
            
            # Check if user has reached 7-day streak
            if user.login_streak == 7:
                # Award 50 points for 7-day streak
                user.points += 50
                # Reset streak after awarding points
                user.login_streak = 0
        else:
            # Reset streak if more than 24 hours have passed
            user.login_streak = 1
        
        # Update last login time
        user.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
            'streak_points_earned': 50 if user.login_streak == 0 else 0  # Indicate if streak points were earned
        })
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# **Logout (Blacklist Token)**
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

# **User Profile**
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# **Update Profile**
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully!"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# **Change Password**
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(new_password, user=user)
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully!"})
    except ValidationError as e:
        return Response({"errors": e.messages}, status=status.HTTP_400_BAD_REQUEST)

# **Admin Dashboard Data**
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dash(request):
    orders = Order.objects.all()
    total_orders = orders.count()
    total_sales = orders.aggregate(Sum('total_price'))['total_price__sum']
    total_products = Product.objects.all().count()
    total_users = CustomUser.objects.all().count()

    return Response({
        'total_orders': total_orders,
        'total_sales': total_sales,
        'total_products': total_products,
        'total_users': total_users
    })

# **Contact Form API**
@api_view(['POST'])
def contact(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Message sent successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# **Rewards API**
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claim_login_streak_reward(request):
    user = request.user
    if user.login_streak >= 7:
        from discounts.models import Discount
        from django.utils import timezone
        from datetime import timedelta
        
        discount = Discount.objects.create(
            user=user,
            discount_percentage=10,
            reason="7-day login streak reward",
            valid_until=timezone.now() + timedelta(days=7)
        )
        
        user.login_streak = 0
        user.save()
        
        return Response({
            'message': 'Congratulations! You have claimed your 7-day login streak reward.',
            'discount': discount.discount_percentage,
            'valid_until': discount.valid_until
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': f'You need {7 - user.login_streak} more days to claim this reward.'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claim_ink_bottle_points(request):
    user = request.user
    if user.ink_bottle_returns > 0:
        from discounts.models import Discount
        from django.utils import timezone
        from datetime import timedelta
        
        discount = Discount.objects.create(
            user=user,
            discount_percentage=5 * user.ink_bottle_returns,
            reason="Ink bottle return reward",
            valid_until=timezone.now() + timedelta(days=30)
        )
        
        user.ink_bottle_returns = 0
        user.save()
        
        return Response({
            'message': f'Congratulations! You have claimed your ink bottle return reward.',
            'discount': discount.discount_percentage,
            'valid_until': discount.valid_until
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'You have no ink bottles to return.'
        }, status=status.HTTP_400_BAD_REQUEST)
