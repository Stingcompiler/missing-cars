from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, ClaimRequestViewSet, ContactMethodViewSet, UserViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet)
router.register(r'claims', ClaimRequestViewSet)
router.register(r'contacts', ContactMethodViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    # أضف هذا السطر هنا يدوياً قبل الـ router
    
    path('', include(router.urls)),
]