from rest_framework_simplejwt.views import TokenObtainPairView ,TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.views import APIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework.authentication import SessionAuthentication

class UnsafeSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return None # تعطيل CSRF لطلب تسجيل الخروج فقط

class UserDetailView(APIView):
    # الحماية: يسمح فقط للمستخدمين المسجلين (من لديهم كوكي صالح)
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # request.user يتم تعبئتها تلقائياً عبر الـ Authentication Classes
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class OverrideObtainToken(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # 1. Generate token (access and refresh)
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access = response.data.get('access')   
            refresh = response.data.get('refresh')
            
            # 2. Set cookies
            response.set_cookie(
                'access_token', 
                access, 
                max_age=3600,
                httponly=True,
                samesite='Lax', # Must be 'Lax' or 'None' (None requires Secure=True)
                secure=False,
               # Set to False because you are on http://localhost
                path='/',       # Ensure it's available for all paths
            )
            response.set_cookie(
                'refresh_token', 
                 refresh, max_age=3600,
                 httponly=True,
                 samesite='lax',
                 secure=False ,
                
                  path='/',  
            )
            
            # 3. Clean sensitive data from the response body
            # Using .pop() is safer than 'del' to avoid KeyError if they don't exist
            response.data.pop('access', None)
            response.data.pop('refresh', None)
            
        # --- THE MISSING LINE ---
        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # 1. Extract refresh token from the cookie
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({"detail": "No refresh token provided"}, status=401)

        # 2. Inject it into data so the parent class serializer can validate it
        # The serializer expects {'refresh': '...'}
        request.data['refresh'] = refresh_token

        try:
            # 3. Call the standard SimpleJWT refresh logic
            response = super().post(request, *args, **kwargs)
            
            # 4. Extract the NEW access token from the response data
            new_access_token = response.data.get('access')

            # 5. Set the new Access Token Cookie
            response.set_cookie(
                'access_token',
                new_access_token,
                max_age=3600,
                httponly=True,
                samesite='lax',
                secure=False # Set to True in production (HTTPS)
            )

            # 6. Remove the token from the body for security
            
            response.data.pop('access', None)
            # SimpleJWT might return a new refresh token (if rotation is on), handle that if needed:
            if 'refresh' in response.data:
                 refresh = response.data['refresh']
                 response.set_cookie('refresh_token', refresh, httponly=True, samesite='lax', secure=False)
                 del response.data['refresh']

            return response

        except (InvalidToken, TokenError) as e:
            return Response({"detail": str(e)}, status=401)
        

# views.py
class LogoutView(APIView):
    authentication_classes = [] # تعطيل مؤقت
    permission_classes = []     # تعطيل مؤقت

    def post(self, request):
        print("Logout request received on server!") # سيظهر في terminal الـ Django
        response = Response({"status": "ok"}, status=200)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response