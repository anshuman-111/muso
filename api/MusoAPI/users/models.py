from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4


# User model
class AppUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    username = models.CharField(max_length=100, null=True, unique=True)
    password = models.CharField(max_length=300)
    email = models.EmailField(unique=True)
    suburb = models.CharField(blank=True, null=True, max_length=60)
    last_login = models.DateTimeField(auto_now_add=True)
    last_rental_given = models.DateTimeField(null=True)
    last_rental_taken = models.DateTimeField(null=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self) -> str:
        return self.email
