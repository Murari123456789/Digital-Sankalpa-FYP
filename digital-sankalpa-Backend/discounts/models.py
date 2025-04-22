from django.db import models
from django.utils import timezone
from accounts.models import CustomUser
import random
import string


class Discount(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    discount_percentage = models.FloatField()
    reason = models.CharField(max_length=255)  # e.g., "Ink Bottle Return", "Login Streak"
    valid_until = models.DateTimeField()

    def __str__(self):
        return f"{self.discount_percentage}% discount for {self.user.username}"


class PromoCode(models.Model):
    code = models.CharField(max_length=20, unique=True, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_percentage = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField()
    max_uses = models.PositiveIntegerField(default=1)
    current_uses = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def generate_code(length=8):
        """Generate a random promo code."""
        while True:
            # Generate a random string of letters and numbers
            chars = string.ascii_uppercase + string.digits
            code = ''.join(random.choice(chars) for _ in range(length))
            
            # Check if this code already exists
            if not PromoCode.objects.filter(code=code).exists():
                return code

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_code()
        super().save(*args, **kwargs)

    def __str__(self):
        discount_type = '%' if self.is_percentage else 'Rs'
        return f"{self.code} - {self.discount_amount}{discount_type}"

    @property
    def is_valid(self):
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now <= self.valid_until and
            self.current_uses < self.max_uses
        )
