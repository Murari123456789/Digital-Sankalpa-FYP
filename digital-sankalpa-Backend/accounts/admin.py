from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Only show selected fields in the admin form
    fieldsets = (
        (None, {'fields': ('username', 'first_name', 'last_name', 'email', 'is_active', 'date_joined', 'login_streak', 'points')}),
    )
    # Restore password fields for add form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    list_display = ('username', 'email', 'is_active', 'date_joined', 'login_streak', 'points')
    list_filter = ()  # Remove all filters from the user list page
    exclude = ('last_login', 'is_superuser', 'groups', 'user_permissions', 'ink_bottle_returns', 'is_staff', 'password')

admin.site.unregister(CustomUser) if admin.site.is_registered(CustomUser) else None
admin.site.register(CustomUser, CustomUserAdmin)