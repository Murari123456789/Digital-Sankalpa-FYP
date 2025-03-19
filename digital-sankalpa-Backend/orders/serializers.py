from rest_framework import serializers
from orders.models import CartItem, Order
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_name', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.product.price * obj.quantity

class OrderSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'uuid', 'total_price', 'final_price', 'payment_status', 'cart_items']

    def get_total_price(self, obj):
        return sum(item.product.price * item.quantity for item in obj.cart_items.all())
