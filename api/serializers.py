from rest_framework import serializers
from .models import User, ContactMethod, Car, CarImage, ClaimRequest

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model() # This fetches 'api.User' automatically

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'is_admin', 'role',
                   'email', 'is_staff', 'date_joined', 'password']
        read_only_fields = ['date_joined']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

# 2. Contact Method 
class ContactMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMethod
        fields = ['id', 'type', 'value', 'url', 'display_text', 'is_public']

# 3. Car Image Serializer
class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'image', 'uploaded_at']


class CarSerializer(serializers.ModelSerializer):
    # This shows images when you GET a car
    images = CarImageSerializer(many=True, read_only=True)
    
    # This allows you to upload multiple images when you POST a car
    # We use 'uploaded_images' as a key for the incoming files
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Car
        fields = [
            'id', 'status', 'brand', 'model', 'chassis_number', 
            'plate_number', 'year', 'color', 'public_description', 
            'location_public', 'location_encrypted', 'images', 
            'uploaded_images', 'created_by', 'created_at','updated_at'
        ]
    
    def to_representation(self, instance):
        """
        Run this code every time we convert a Car to JSON.
        """
        # Get the standard data (including location_encrypted)
        data = super().to_representation(instance)
        
        # Get the current user from the request context
        user = self.context.get('request').user if self.context.get('request') else None
        
        # Check if user is NOT an admin
        is_admin = user and user.is_authenticated and getattr(user, 'is_admin', False)
        
        if not is_admin:
            # Remove the secret field from the output dictionary
            data.pop('location_encrypted', None)
            
        return data

    def create(self, validated_data):
        # 1. Pop the images out of the validated data
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # 2. Create the Car instance first
        car = Car.objects.create(**validated_data)
        
        # 3. Create a CarImage instance for every uploaded file
        for image in uploaded_images:
            CarImage.objects.create(car=car, image=image)
            
        return car

    def update(self, instance, validated_data):
        # 1. استخراج الصور الجديدة من البيانات القادمة
        uploaded_images = validated_data.pop('uploaded_images', [])

        # 2. تحديث بيانات السيارة الأساسية (الماركة، الموديل، اللون، إلخ)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 3. حفظ الصور الجديدة وربطها بالسيارة الحالية
        for image in uploaded_images:
            CarImage.objects.create(car=instance, image=image)

        return instance

# New Serializer specifically for Admins
class CarAdminSerializer(CarSerializer):
    class Meta(CarSerializer.Meta):
        # Add the encrypted location to the existing fields list
        fields = CarSerializer.Meta.fields + ['location_encrypted']
    
    
# 5. Claim Request Serializer
class ClaimRequestSerializers(serializers.ModelSerializer):
    car_details = CarSerializer(source='car', read_only=True)
    
    class Meta:
        model = ClaimRequest
        fields = [
            'id', 'status', 'car', 'car_details', 'claimant_name', 
            'claimant_contact', 'proof_files', 'admin_notes', 'created_at'
        ]
        read_only_fields = ['status', 'admin_notes', 'reviewed_by', 'reviewed_at']
        
class ClaimRequestSerializer(serializers.ModelSerializer):
    # This allows you to see the car details instead of just the ID in the table
    car_details = CarSerializer(source='car', read_only=True) 
    proof_files = serializers.FileField(required=False, allow_null=True)
    class Meta:
        model = ClaimRequest
        fields = '__all__'