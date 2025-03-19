from django.db import models
from accounts.models import CustomUser


class Discount(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    discount_percentage = models.FloatField()
    reason = models.CharField(max_length=255)  # e.g., "Ink Bottle Return", "Login Streak"
    valid_until = models.DateTimeField()

    def __str__(self):
        return f"{self.discount_percentage}% discount for {self.user.username}"

