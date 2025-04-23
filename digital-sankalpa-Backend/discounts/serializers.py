from rest_framework import serializers
from .models import PromoCode

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
