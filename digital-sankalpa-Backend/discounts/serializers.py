from rest_framework import serializers
from .models import PromoCode

class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = ['code', 'discount_amount', 'is_percentage', 'is_valid']
        read_only_fields = ['is_valid']
