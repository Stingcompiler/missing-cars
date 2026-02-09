from django.contrib import admin
from .models import Car ,CarImage ,ClaimRequest ,ContactMethod ,User
# Register your models here.
admin.site.register(Car)
admin.site.register(CarImage)
admin.site.register(ClaimRequest)
admin.site.register(ContactMethod)
admin.site.register(User)