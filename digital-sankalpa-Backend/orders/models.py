from django.db import models
from accounts.models import CustomUser
from products.models import Product


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


class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="orders")
    cart_items = models.ManyToManyField(CartItem)
    uuid = models.CharField(max_length=8, unique=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=[("pending", "Pending"), ("completed", "Completed")])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.uuid} by {self.user.username}"
