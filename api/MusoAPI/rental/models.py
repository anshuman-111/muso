from django.db import models

from django.db.models import F, Q, CheckConstraint
from django.utils import timezone



class Rentals(models.Model):
    """
    Represents a rental entry for musical instruments.

    Attributes:
        FREQ (tuple): Choices for rental frequency, including "hour", "day", and "week".
        rental_create (DateTimeField): Date and time of rental creation (auto-generated).
        rental_id (BigAutoField): Primary key for the rental.
        rental_title (CharField): Title of the rental (max length: 100 characters).
        rental_desc (CharField): Description of the rental (max length: 250 characters).
        rental_frequency (CharField): Frequency of the rental (choices from FREQ).
        rental_rate (IntegerField): Rental rate.
        rental_instrument_type (CharField): Type of the rented instrument (max length: 255 characters).
        rental_location (CharField): Location of the rental (max length: 255 characters).
        rental_start (DateTimeField): Start date and time of the rental.
        rental_end (DateTimeField): End date and time of the rental.
        is_rental_active (BooleanField): Indicates whether the rental is currently active.
        rental_avail_start (DateTimeField): Start date and time of rental availability.
        rental_avail_end (DateTimeField): End date and time of rental availability.
        rental_image_url (CharField): URL of the rental image (max length: 512 characters).
        rental_return_approved_by_owner (BooleanField): Indicates if return is approved by the owner.
        owner (ForeignKey): Foreign key to the owner of the rental (related_name: "owner").
        renter (ForeignKey): Foreign key to the renter of the rental (related_name: "renter").

    Methods:
        is_rental_active: Property method to check if the rental is currently active.
        save: Override to save the model instance.
    """
    
    FREQ = {("hour", "hour"), ("day", "day"), ("week", "week")}
    rental_created_on = models.DateTimeField(auto_now=True)
    rental_id = models.BigAutoField(primary_key=True)
    rental_title = models.CharField(max_length=100, blank=True, null=True)
    rental_desc = models.CharField(max_length=250, blank=True, null=True)
    rental_frequency = models.CharField(choices=FREQ, max_length=50, blank=True, null=True)
    rental_rate = models.IntegerField(blank=True, null=True)
    rental_instrument_type = models.CharField(
        max_length=255, null=True, blank=True
    )
    rental_location = models.CharField(max_length=255, null=True)
    rental_start = models.DateTimeField(null=True)
    rental_end = models.DateTimeField(null=True)
    is_rental_active = models.BooleanField(default=False)
    rental_avail_start = models.DateTimeField(null=True)
    rental_avail_end = models.DateTimeField(null=True)
    rental_image_url = models.CharField(null=True, blank=True, max_length=512)
    rental_return_approved_by_owner = models.BooleanField(null=True, blank=True)
    
    owner = models.ForeignKey(
        "users.AppUser", related_name="owner", null=True, on_delete=models.CASCADE
    )
    renter = models.ForeignKey(
        "users.AppUser", related_name="renter", null=True, on_delete=models.CASCADE
    )

    @property
    def is_rental_active(self):
        """
        Check if the rental is currently active.

        Returns:
            bool: True if the rental is active, False otherwise.
        """
        today = timezone.now()
        return today < self.rental_end if self.rental_end else False
    

    @is_rental_active.setter
    def is_rental_active(self):
        # Empty setter
        pass
    
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
    
        
    class Meta:
        constraints = [
            CheckConstraint(
                check=~Q(owner=F('renter')),
                name='owner_cannot_be_renter'
            )
        ]
        
