# authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # 1. Get token from cookie
        raw_token = request.COOKIES.get("access_token")

        if raw_token is None:
            return None  # No auth, DRF will continue

        # 2. Validate token
        validated_token = self.get_validated_token(raw_token)

        # 3. Get user
        user = self.get_user(validated_token)

        return (user, validated_token)
