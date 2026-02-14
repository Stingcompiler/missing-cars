import os
from pathlib import Path
from datetime import timedelta
import mimetypes

# لضمان عدم حدوث خطأ MIME type في ملفات الـ JS والـ CSS
mimetypes.add_type("text/javascript", ".js", True)
mimetypes.add_type("text/css", ".css", True)

BASE_DIR = Path(__file__).resolve().parent.parent

# --- ENVIRONMENT DETECTION ---
# Set PRODUCTION=1 in PythonAnywhere to enable production mode
PRODUCTION = os.environ.get('PRODUCTION', '0') == '1'

# --- SECURITY ---
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-your-fallback-key')

# Debug mode: False in production
DEBUG = not PRODUCTION

# PythonAnywhere domain - replace 'USERNAME' with your actual PythonAnywhere username
PYTHONANYWHERE_USERNAME = os.environ.get('PYTHONANYWHERE_USERNAME', 'missingcars')
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'missingcars.pythonanywhere.com', '.pythonanywhere.com']

# --- APPS ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    "corsheaders",
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist', # لإدارة الـ Blacklist
    'whitenoise.runserver_nostatic', # تحسين أداء static في التطوير
    
    # Local apps
    'api',
]

# --- MIDDLEWARE (الترتيب هنا هو مفتاح الحل) ---
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",           # 1. يجب أن يكون الأول لحل مشكلة الـ CORS
    'django.middleware.security.SecurityMiddleware',    # 2.
    'whitenoise.middleware.WhiteNoiseMiddleware',       # 3. لخدمة ملفات React JS/CSS
    'django.contrib.sessions.middleware.SessionMiddleware',
    "django.middleware.common.CommonMiddleware",        # 4.
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]



# --- REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'mscars.authentication.CookieJWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

ROOT_URLCONF = 'mscars.urls'

# --- TEMPLATES (React Integration) ---
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'frontend' / 'dist'], # مسار مجلد React Build
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mscars.wsgi.application'

# --- DATABASE ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# --- STATIC FILES (WhiteNoise Configuration) ---
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# المسارات التي يبحث فيها Django عن الملفات قبل الـ collectstatic
STATICFILES_DIRS = [
    BASE_DIR / 'frontend' / 'dist',
]

# إعداد WhiteNoise للتعامل مع التخزين والضغط
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
WHITENOISE_AUTOREFRESH = True # للتطوير المحلي

# --- OTHER SETTINGS ---
AUTH_USER_MODEL = 'api.User'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# --- CORS SETTINGS ---
CORS_ALLOW_CREDENTIALS = True

# CORS origins - different for development vs production
if PRODUCTION:
    CORS_ALLOWED_ORIGINS = [
        f"https://{PYTHONANYWHERE_USERNAME}.pythonanywhere.com",
    ]
    CSRF_TRUSTED_ORIGINS = [
        f"https://{PYTHONANYWHERE_USERNAME}.pythonanywhere.com",
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Cookie settings - secure in production (HTTPS)
CSRF_COOKIE_HTTPONLY = False  # frontend must read it
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = PRODUCTION  # True only in production (HTTPS)
SESSION_COOKIE_SECURE = PRODUCTION  # True only in production (HTTPS)
# settings.py

# Add these to handle the cross-port session logic
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

# Ensure these match exactly what you see in the browser address bar
# settings.py

# Change from 'DENY' to 'SAMEORIGIN'
X_FRAME_OPTIONS = 'SAMEORIGIN'


# settings.py

# إعدادات البريد الإلكتروني (Gmail SMTP)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# الإيميل الذي سيقوم بالإرسال (يجب أن يكون صاحب كلمة مرور التطبيق)
EMAIL_HOST_USER = 'musabsting277@gmail.com'

# كلمة مرور التطبيق (تأكد أنها بدون مسافات تماماً)
EMAIL_HOST_PASSWORD = 'earp tfvl hpiq ipas'

# الإيميل الافتراضي الذي يظهر كمرسل (اختياري)
DEFAULT_FROM_EMAIL = 'musabsting277@gmail.com'

# 1. Add these lines!
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media' 

# 2. Fix the minor typo in your email password (remove the extra space at the end)
EMAIL_HOST_PASSWORD = 'earp tfvl hpiq ipas'