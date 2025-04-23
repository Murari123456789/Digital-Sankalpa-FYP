from rest_framework import serializers
from .models import PromoCode, Discount
from accounts.serializers import UserSerializer

class DiscountSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Discount
        fields = ['id', 'user', 'user_details', 'discount_percentage', 'reason', 'valid_until']
        read_only_fields = ['id']

class PromoCodeSerializer(serializers.ModelSerializer):
    uses_remaining = serializers.SerializerMethodField()

    class Meta:
        model = PromoCode
        fields = ['code', 'discount_amount', 'is_percentage', 'is_active',
                'valid_from', 'valid_until', 'max_uses', 'current_uses', 'uses_remaining']

    def get_uses_remaining(self, obj):
        if obj.max_uses:
            return max(0, obj.max_uses - obj.current_uses)
        return None
