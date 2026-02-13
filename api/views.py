from .permissions import IsAdminOrReadOnly, IsAdminOrStaff, IsAdminOnly 
from rest_framework import viewsets ,filters, status ,permissions 
from .models import User, ContactMethod, Car, CarImage, ClaimRequest
from .serializers import (
    UserSerializer, ContactMethodSerializer, 
    CarSerializer, CarImageSerializer, ClaimRequestSerializer ,CarAdminSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

User = get_user_model()
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    Admins can do everything. Staff can view and create users.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """Only admins can delete users"""
        if self.action == 'destroy':
            return [IsAdminOnly()]
        return [IsAdminOrStaff()]

    # Prevent the deletion of the superuser via API
    def perform_destroy(self, instance):
        if instance.is_superuser:
            raise PermissionDenied("لا يمكن حذف الحساب الرئيسي.")
        instance.delete()
        
class UnsafeSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return None # تعطيل التحقق من CSRF مؤقتاً
    
# views.py
class CarViewSet(viewsets.ModelViewSet):
    """
    Public can LIST and RETRIEVE cars.
    Only Admin can CREATE, UPDATE, DELETE cars.
    """
    queryset = Car.objects.all().order_by('-created_at')
    # We remove 'serializer_class = CarSerializer' because we are overriding get_serializer_class
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = [UnsafeSessionAuthentication]
    
    filter_backends = [filters.SearchFilter]
    search_fields = ['brand', 'model', 'plate_number', 'chassis_number', 'location_public']
    
    # --- LOGIC TO SWAP SERIALIZERS STARTS HERE ---
    def get_serializer_class(self):
        # Check if user is authenticated and is an admin
        if (self.request.user.is_authenticated and 
            getattr(self.request.user, 'is_admin', False)):
            return CarAdminSerializer
        
        # Default for anonymous/regular users
        return CarSerializer
    # ---------------------------------------------

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [IsAdminOrReadOnly()] 
        return super().get_permissions()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
     
    # Custom Actions
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def upload_image(self, request, pk=None):
        car = self.get_object()
        image = request.data.get('image')
        if image:
            CarImage.objects.create(car=car, image=image)
            return Response({'status': 'image uploaded'}, status=status.HTTP_201_CREATED)
        return Response({'error': 'no image provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='delete-image/(?P<image_id>[0-9]+)')
    def delete_image(self, request, pk=None, image_id=None):
        try:
            image = CarImage.objects.get(id=image_id, car_id=pk)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CarImage.DoesNotExist:
            return Response({"error": "الصورة غير موجودة"}, status=status.HTTP_404_NOT_FOUND)
                
class ClaimRequestViewSet(viewsets.ModelViewSet):
    """
    Public can CREATE a claim request.
    Admin and Staff can LIST and UPDATE claims.
    Only Admin can DELETE claims.
    """
    queryset = ClaimRequest.objects.all().order_by('-created_at')
    serializer_class = ClaimRequestSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        # Allow anyone to create a claim
        if self.action == 'create':
            return [permissions.AllowAny()]
        # Only admin can delete claims
        if self.action == 'destroy':
            return [IsAdminOnly()]
        # Admin and staff can see claims and update them
        return [IsAdminOrStaff()]

    def perform_create(self, serializer):
        serializer.save()

    # Custom Action: Approve a claim
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        claim = self.get_object()
        claim.status = ClaimRequest.Status.APPROVED
        claim.reviewed_by = request.user
        claim.reviewed_at = timezone.now()
        claim.save()
        
        # Optional: Automatically mark the car as claimed?
        # claim.car.status = Car.Status.CLAIMED
        # claim.car.save()
        
        return Response({'status': 'claim approved'})

    # Custom Action: Reject a claim
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        claim = self.get_object()
        claim.status = ClaimRequest.Status.REJECTED
        claim.reviewed_by = request.user
        claim.reviewed_at = timezone.now()
        claim.save()
        return Response({'status': 'claim rejected'})

class ContactMethodViewSet(viewsets.ModelViewSet):
    queryset = ContactMethod.objects.filter(is_public=True)
    serializer_class = ContactMethodSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def perform_create(self, serializer):
        # This line automatically sets the 'owner' to the person making the request
        serializer.save(owner=self.request.user)
        
        

@method_decorator(csrf_exempt, name='dispatch')
class ContactEmailView(APIView):
    # السماح للجميع بالإرسال (حتى غير المسجلين)
    permission_classes = [AllowAny]
    # لضمان عدم حدوث خطأ 403 إذا كان المستخدم لديه جلسة قديمة
    authentication_classes = [] 
    
    def post(self, request):
        try:
            # 1. استلام البيانات
            name = request.data.get('name')
            contact = request.data.get('contact')
            subject = request.data.get('subject')
            message = request.data.get('message')

            # 2. تحضير القالب
            context = {
                'name': name,
                'contact': contact,
                'subject': subject,
                'message': message,
            }
            # تأكد من وجود ملف email_template.html في مجلد templates
            html_content = render_to_string('email_template.html', context)
            text_content = strip_tags(html_content)

            # 3. إرسال الإيميل
            email = EmailMultiAlternatives(
                subject=f"⚠️ {subject}: {name}",
                body=text_content,
                from_email='musabsting277@gmail.com',
                to=['musabsting277@gmail.com'],
            )
            email.attach_alternative(html_content, "text/html")
            email.send()

            return Response({"status": "success", "message": "Email sent!"}, status=200)
            
        except Exception as e:
            # طباعة الخطأ في السيرفر للمتابعة
            print(f"Error: {e}")
            return Response({"error": str(e)}, status=500)
