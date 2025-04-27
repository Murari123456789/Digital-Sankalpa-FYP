from django.db import models
from accounts.models import CustomUser
from products.models import Product
from discounts.models import Discount


class CartItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.name} in {self.user.username}'s cart"
    
    @classmethod
    def active_items(cls):
        return cls.objects.filter(active=True)


class ShippingAddress(models.Model):
    name = models.CharField(max_length=100)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.name}, {self.city}"


class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="orders")
    cart_items = models.ManyToManyField(CartItem)
    uuid = models.CharField(max_length=8, unique=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    points_redeemed = models.PositiveIntegerField(default=0)
    point_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=[("pending", "Pending"), ("completed", "Completed")])
    payment_method = models.CharField(max_length=50, default="esewa")
    shipping_address = models.ForeignKey(ShippingAddress, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used_discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Order {self.uuid} by {self.user.username}"
