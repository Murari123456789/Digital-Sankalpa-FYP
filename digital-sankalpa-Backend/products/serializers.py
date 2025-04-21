from rest_framework import serializers
from django.db.models import Avg
from .models import Product, Wishlist, Review

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_id', 'username', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['user']

class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(source='product_reviews', many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    sale_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_average_rating(self, obj):
        avg = obj.product_reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_total_reviews(self, obj):
        return obj.product_reviews.count()

    def get_sale_price(self, obj):
        return obj.sale_price

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'created_at']
        read_only_fields = ['user']
