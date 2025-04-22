from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PromoCode
from .serializers import PromoCodeSerializer
from django.utils import timezone

@api_view(['POST'])
def validate_promo_code(request):
    code = request.data.get('code')
    
    try:
        promo = PromoCode.objects.get(code=code)
        now = timezone.now()
        
        # Check each validation condition separately
        if not promo.is_active:
            return Response({
                'valid': False,
                'message': 'This promo code has been deactivated'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if now < promo.valid_from:
            return Response({
                'valid': False,
                'message': f'This promo code is not valid yet. It will be active from {promo.valid_from.strftime("%Y-%m-%d %H:%M")}'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if now > promo.valid_until:
            return Response({
                'valid': False,
                'message': f'This promo code has expired on {promo.valid_until.strftime("%Y-%m-%d %H:%M")}'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if promo.current_uses >= promo.max_uses:
            return Response({
                'valid': False,
                'message': 'This promo code has reached its maximum usage limit'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = PromoCodeSerializer(promo)
        return Response({
            'valid': True,
            'promo_code': serializer.data
        })
        
    except PromoCode.DoesNotExist:
        return Response({
            'valid': False,
            'message': 'Invalid promo code'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def apply_promo_code(request):
    code = request.data.get('code')
    order_total = float(request.data.get('order_total', 0))
    
    try:
        promo = PromoCode.objects.get(code=code)
        now = timezone.now()
        
        # Check each validation condition separately
        if not promo.is_active:
            return Response({
                'valid': False,
                'message': 'This promo code has been deactivated'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if now < promo.valid_from:
            return Response({
                'valid': False,
                'message': f'This promo code is not valid yet. It will be active from {promo.valid_from.strftime("%Y-%m-%d %H:%M")}'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if now > promo.valid_until:
            return Response({
                'valid': False,
                'message': f'This promo code has expired on {promo.valid_until.strftime("%Y-%m-%d %H:%M")}'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if promo.current_uses >= promo.max_uses:
            return Response({
                'valid': False,
                'message': 'This promo code has reached its maximum usage limit'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate discount
        if promo.is_percentage:
            discount = (float(promo.discount_amount) / 100) * order_total
        else:
            discount = float(promo.discount_amount)
            
        # Update usage count
        promo.current_uses += 1
        promo.save()
        
        return Response({
            'valid': True,
            'discount_amount': discount,
            'final_total': order_total - discount
        })
        
    except PromoCode.DoesNotExist:
        return Response({
            'valid': False,
            'message': 'Invalid promo code'
        }, status=status.HTTP_404_NOT_FOUND)
