from rest_framework import serializers
from accounts.models import CustomUser, Contact
import logging

logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'password_confirm', 'login_streak', 'ink_bottle_returns', 'points', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
            'login_streak': {'read_only': True},
            'ink_bottle_returns': {'read_only': True},
            'points': {'read_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError("Username is required.")
        # For existing user (update), exclude current user from uniqueness check
        if self.instance and self.instance.username == value:
            return value
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        # For existing user (update), exclude current user from uniqueness check
        if self.instance and self.instance.email == value:
            return value
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate(self, data):
        # Skip password validation for profile updates (when we have an instance)
        if self.instance:
            # Remove password fields if they're empty (for profile updates)
            if 'password' in data and not data.get('password'):
                data.pop('password', None)
                data.pop('password_confirm', None)
                data.pop('passwordConfirm', None)
                return data
        
        password = data.get('password')
        # Try both snake_case and camelCase for password confirmation
        password_confirm = data.get('password_confirm') or data.get('passwordConfirm')

        # Only validate password fields if they're provided (for profile updates)
        if self.instance and not password:
            return data

        if not password:
            raise serializers.ValidationError({"password": "Password is required."})

        if not password_confirm:
            raise serializers.ValidationError({"password_confirm": "Password confirmation is required."})

        if password != password_confirm:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return data

    def create(self, validated_data):
        try:
            # Remove both possible password confirmation fields
            validated_data.pop('password_confirm', None)
            validated_data.pop('passwordConfirm', None)
            
            # Set default values for required fields
            validated_data.setdefault('first_name', '')
            validated_data.setdefault('last_name', '')
            validated_data.setdefault('is_active', True)
            
            password = validated_data.pop('password')
            user = CustomUser.objects.create(**validated_data)
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            logger.error(f'Error creating user: {str(e)}')
            raise serializers.ValidationError({"error": str(e)})

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message']
