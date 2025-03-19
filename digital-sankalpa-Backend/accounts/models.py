from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    login_streak = models.IntegerField(default=0)  # Tracks consecutive logins
    ink_bottle_returns = models.IntegerField(default=0)  # Counts returned ink bottles

    def __str__(self):
        return self.username


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return self.name