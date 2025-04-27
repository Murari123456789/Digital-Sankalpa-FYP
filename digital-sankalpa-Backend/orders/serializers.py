from rest_framework import serializers
from orders.models import CartItem, Order, ShippingAddress
from products.models import Product
from django.conf import settings

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    product_id = serializers.IntegerField(source='product.id')
    image = serializers.SerializerMethodField()
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    total_price = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        if obj.product.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.product.image.url)
            return f"http://localhost:8000{obj.product.image.url}"
        return None

    class Meta:
        model = CartItem
        fields = ['id', 'product_name', 'product_id', 'image', 'price', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.product.price * obj.quantity

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['id', 'name', 'street', 'city', 'postal_code', 'phone']

class OrderSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True)
    total_price = serializers.SerializerMethodField()
    points_redeemed = serializers.IntegerField()
    point_discount = serializers.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = ShippingAddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'uuid', 'total_price', 'discount', 'points_redeemed', 'point_discount', 
                 'final_price', 'payment_status', 'payment_method', 'shipping_address', 
                 'cart_items', 'created_at']

    def get_total_price(self, obj):
        return sum(item.product.price * item.quantity for item in obj.cart_items.all())
