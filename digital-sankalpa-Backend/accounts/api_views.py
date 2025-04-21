from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Contact, CustomUser
from .serializers import UserSerializer, ContactSerializer
from products.models import Product
from orders.models import Order
from django.db.models import Sum

# **Register User**
@api_view(['POST'])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# **Login User and Return JWT Token**
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
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
