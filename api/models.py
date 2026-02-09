from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import FileExtensionValidator

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        STAFF = 'staff', 'Staff'
        USER = 'user', 'User'
    
    full_name = models.CharField(max_length=255)
    is_admin = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN or self.is_admin
    
    @property
    def is_staff_user(self):
        return self.role == self.Role.STAFF
    
    @property
    def can_manage(self):
        """Returns True if user can manage (create, update) - admins and staff"""
        return self.is_admin_user or self.is_staff_user
    
    @property
    def can_delete(self):
        """Returns True if user can delete - only admins"""
        return self.is_admin_user

    def __str__(self):
        return self.username

class ContactMethod(models.Model):
    # 1. Using TextChoices for cleaner options
    class Type(models.TextChoices):
        WHATSAPP = 'whatsapp', 'Whatsapp'
        TELEGRAM = 'telegram', 'Telegram'
        EMAIL = 'email', 'Email'
        PHONE = 'phone', 'Phone'
        MESSENGER = 'messenger', 'Messenger'

    type = models.CharField(max_length=20, choices=Type.choices)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    value = models.CharField(max_length=255) # phone number, username, or email
    url = models.URLField(blank=True, null=True) 
    is_public = models.BooleanField(default=True)
    display_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-generate URL based on type
        if not self.url and self.value:
            if self.type == self.Type.WHATSAPP:
               self.url = f"https://wa.me/{self.value}"
            elif self.type == self.Type.TELEGRAM:
               self.url = f"https://t.me/{self.value.lstrip('@')}"
            elif self.type == self.Type.MESSENGER:
                self.url = f"https://m.me/{self.value}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.owner.username} ({self.get_type_display()})"

class Car(models.Model):
    # 2. Car Status Choices
    class Status(models.TextChoices):
        FOUND = 'found', 'Found'
        CLAIMED = 'claimed', 'Claimed'
        DELIVERED = 'delivered', 'Delivered'
        REMOVED = 'removed', 'Removed'
        
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.FOUND)

    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100, blank=True, null=True)
    
    # Removed unique=True so you can save cars with unknown/damaged chassis
    chassis_number = models.CharField(max_length=100, blank=True, null=True) 
    plate_number = models.CharField(max_length=50, blank=True, null=True)
    year = models.IntegerField(null=True, blank=True)
    color = models.CharField(max_length=50)
    
    public_description = models.TextField(blank=True)
    private_description = models.TextField(blank=True) # Admin private notes
    
    location_public = models.CharField(max_length=255) # Visible to everyone
    location_encrypted = models.TextField(blank=True)  # Visible only to Admin/Owner
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.brand} {self.model} - {self.plate_number}"

# Added CarImage model as discussed to handle multiple photos
class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='car_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class ClaimRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    car = models.ForeignKey('Car', on_delete=models.CASCADE, related_name='claims')
    claimant_name = models.CharField(max_length=255)
    claimant_contact = models.CharField(max_length=255)
    
    # Updated to FileField to handle actual uploads
    proof_files = models.FileField(
        upload_to='claims/proofs/%Y/%m/', 
        null=True, 
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'])]
    )
    
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey('api.User', null=True, blank=True, on_delete=models.SET_NULL)
    reviewed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Claim: {self.car.brand} by {self.claimant_name}"