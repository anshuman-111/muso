from rest_framework import serializers
from .models import Rentals
from users.models import AppUser

class RentalCreateSerialzer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
   
    class Meta:
        model = Rentals
        fields = [
            "rental_id",
            "rental_title",
            "rental_desc",
            "rental_frequency",
            "rental_rate",
            "rental_location",
            "rental_instrument_type",
            "rental_avail_start",
            "rental_image_url",
            "rental_avail_end",
            "owner",
            "owner_username",
        ]

        extra_kwargs = {"rental_id": {"read_only": True}}

class RentalSearchSerialzer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
   
    class Meta:
        model = Rentals
        fields = [
            "rental_id",
            "rental_title",
            "rental_desc",
            "rental_frequency",
            "rental_rate",
            "rental_location",
            "rental_instrument_type",
            "rental_avail_start",
            "rental_image_url",
            "rental_avail_end",
            "owner_username",
        ]

        extra_kwargs = {"rental_id": {"read_only": True}}

class RentalTakeSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Rentals
        fields = [
            "rental_id",
            "rental_start",
            "rental_end",
            "rental_avail_start",
            "rental_image_url",
            "rental_avail_end",
            "is_rental_active",
            "renter",
        ]

        extra_kwargs = {"rental_id": {"read_only": True}}
        
        
class RentalAllInfoSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    renter_username = serializers.CharField(source='renter.username', read_only=True)
    class Meta:
        model = Rentals
        fields = [
            "rental_id",
            "rental_title",
            "rental_desc",
            "rental_frequency",
            "rental_rate",
            "rental_location",
            "rental_instrument_type",
            "rental_avail_start",
            "rental_avail_end",
            "is_rental_active",
            "rental_image_url",
            "owner",
            "owner_username",
            "renter_username",
            "rental_start",
            "rental_end",
            "renter",
        ]
        
        extra_kwargs = {"rental_id": {"read_only": True}}
        