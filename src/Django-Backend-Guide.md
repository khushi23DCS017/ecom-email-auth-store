
# Django Backend Implementation Guide for Email Verification System

This guide outlines how to implement the Django backend for your React email verification system. Follow these steps to set up your Django project.

## 1. Initial Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install django djangorestframework django-cors-headers python-decouple
```

## 2. Create Django Project

```bash
django-admin startproject email_auth_project
cd email_auth_project
django-admin startapp users
```

## 3. Configure settings.py

Add the following to your `email_auth_project/settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',
    'users',
]

MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    # other middleware...
]

# Allow React frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev server
]

# Custom user model
AUTH_USER_MODEL = 'users.User'

# Email configuration (for Gmail)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'  # Use environment variable in production
EMAIL_HOST_PASSWORD = 'your-app-password'  # Use environment variable in production

# For development/testing you can use console backend
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Token expiration time (in seconds) - 24 hours
EMAIL_TOKEN_EXPIRY = 86400
```

## 4. Create Custom User Model

In `users/models.py`:

```python
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)  # Field for email verification
    date_joined = models.DateTimeField(auto_now_add=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email
```

## 5. Create Serializers

In `users/serializers.py`:

```python
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_verified']
        read_only_fields = ['is_verified']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        # Implementation depends on your login logic
        return data
```

## 6. Create Utility Functions for Email Verification

In `users/utils.py`:

```python
from django.conf import settings
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
from django.core.mail import send_mail
from django.urls import reverse

def generate_token(email):
    """Generate a secure token with expiry based on email"""
    signer = TimestampSigner()
    return signer.sign(email)

def verify_token(token):
    """Verify token and return email if valid"""
    signer = TimestampSigner()
    try:
        # Check if token is valid and not expired
        email = signer.unsign(token, max_age=settings.EMAIL_TOKEN_EXPIRY)
        return email
    except (SignatureExpired, BadSignature):
        return None

def send_verification_email(request, user):
    """Send verification email with token"""
    token = generate_token(user.email)
    
    # For production, use your actual frontend URL
    verification_link = f"http://localhost:3000/verify-email?token={token}"
    
    subject = "Verify your email address"
    message = f"""
    Hi there,
    
    Thank you for signing up! Please verify your email address by clicking the link below:
    
    {verification_link}
    
    This link will expire in 24 hours.
    
    Best regards,
    Your App Team
    """
    
    return send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )
```

## 7. Create Views

In `users/views.py`:

```python
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from .utils import send_verification_email, verify_token

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = True  # User is active but not verified
            user.save()
            
            # Send verification email
            send_verification_email(request, user)
            
            return Response({"detail": "User created. Please check your email for verification."}, 
                           status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response({"detail": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        email = verify_token(token)
        
        if not email:
            return Response({"detail": "Invalid or expired token"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if user.is_verified:
                return Response({"detail": "Email already verified"}, status=status.HTTP_200_OK)
            
            user.is_verified = True
            user.save()
            
            return Response({"detail": "Email verified successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class ResendVerificationView(APIView):
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            
            if user.is_verified:
                return Response({"detail": "Email is already verified"}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Send verification email
            send_verification_email(request, user)
            
            return Response({"detail": "Verification email sent"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # For security, don't reveal that the user doesn't exist
            return Response({"detail": "If a user with this email exists, a verification email has been sent"}, 
                           status=status.HTTP_200_OK)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data.get('password', '')
            
            try:
                user = User.objects.get(email=email)
                
                # Check if email is verified
                if not user.is_verified:
                    return Response({"detail": "Email not verified"}, 
                                   status=status.HTTP_403_FORBIDDEN)
                
                # Check credentials (if password is required)
                if password and not user.check_password(password):
                    return Response({"detail": "Invalid credentials"}, 
                                   status=status.HTTP_401_UNAUTHORIZED)
                
                # Generate token
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    "token": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserSerializer(user).data
                })
            except User.DoesNotExist:
                return Response({"detail": "Invalid credentials"}, 
                               status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## 8. Configure URLs

In `users/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('verify-email/', views.VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verification/', views.ResendVerificationView.as_view(), name='resend-verification'),
    path('login/', views.LoginView.as_view(), name='login'),
]
```

In `email_auth_project/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
]
```

## 9. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## 10. Run the Server

```bash
python manage.py runserver
```

## Implementation Notes

1. **Token Generation**: We use Django's built-in signing module to create secure, time-limited tokens.

2. **Security**:
   - All sensitive operations require verified email
   - Tokens expire after a configurable time (default: 24 hours)
   - No sensitive information is exposed in error messages

3. **Email Sending**:
   - For production, set up proper SMTP settings using environment variables
   - For development, use the console backend to see emails in terminal

4. **Login Flexibility**:
   - The system can work with or without passwords
   - If no password is provided, email verification is required

5. **Additional Features**:
   - Implement password reset functionality if passwords are used
   - Add rate limiting to prevent abuse of email sending endpoints
   - Add proper logging for security events
