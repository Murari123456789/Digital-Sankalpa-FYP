from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Discount
from .serializers import DiscountSerializer
from accounts.models import CustomUser
from django.utils import timezone
from datetime import timedelta

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_user_discount(request):
    """Create a discount for a specific user. Only admin users can create discounts."""
    user_id = request.data.get('user_id')
    discount_percentage = request.data.get('discount_percentage')
    reason = request.data.get('reason')
    valid_days = request.data.get('valid_days', 30)  # Default 30 days validity

    if not all([user_id, discount_percentage, reason]):
        return Response({
            'error': 'Please provide user_id, discount_percentage, and reason'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Calculate valid_until date
    valid_until = timezone.now() + timedelta(days=valid_days)

    # Create the discount
    discount = Discount.objects.create(
        user=user,
        discount_percentage=discount_percentage,
        reason=reason,
        valid_until=valid_until
    )

    return Response({
        'message': f'Discount created successfully for {user.username}',
        'discount': DiscountSerializer(discount).data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_discounts(request):
    """Get all active discounts for the current user"""
    discounts = Discount.objects.filter(
        user=request.user,
        valid_until__gte=timezone.now()
    ).order_by('-valid_until')

    return Response({
        'discounts': DiscountSerializer(discounts, many=True).data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_all_discounts(request):
    """List all discounts (active and inactive). Only admin users can view all discounts."""
    discounts = Discount.objects.all().order_by('-valid_until')
    return Response({
        'discounts': DiscountSerializer(discounts, many=True).data
    }, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_discount(request, discount_id):
    """Delete a discount. Only admin users can delete discounts."""
    try:
        discount = Discount.objects.get(id=discount_id)
        discount.delete()
        return Response({'message': 'Discount deleted successfully'}, status=status.HTTP_200_OK)
    except Discount.DoesNotExist:
        return Response({'error': 'Discount not found'}, status=status.HTTP_404_NOT_FOUND)
