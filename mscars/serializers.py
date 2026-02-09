from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        # نرسل الحقول المهمة فقط
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']