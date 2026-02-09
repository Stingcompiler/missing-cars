from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

# Your imports
from .views import OverrideObtainToken, CookieTokenRefreshView, LogoutView, UserDetailView
from api.views import ContactEmailView

urlpatterns = [
    # 1. Backend Routes (Admin & API) - Checked first
    path('admin/', admin.site.urls),
    path('api/contact/', ContactEmailView.as_view(), name='contact_email'), 
    path('api/user/me/', UserDetailView.as_view(), name='user_detail'),
    path('api/token/', OverrideObtainToken.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/', include('api.urls')),
    path('api-auth/', include('rest_framework.urls')),

    # 2. Media Files (STRICT PREFIX)
    # The 'media/' at the start of the regex is the most important part!
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    
]

# 3. Development Static Files (Only for local CSS/JS/Images)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# 4. React SPA Catch-all (MUST BE THE LAST PATTERN)
# This handles adminPageSuction/dashboard by sending it to React
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]