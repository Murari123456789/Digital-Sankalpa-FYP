from django.contrib import admin
from django.utils import timezone
from django import forms
from .models import Discount, PromoCode

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('user', 'discount_percentage', 'reason', 'valid_until')
    list_filter = ('valid_until',)
    search_fields = ('user__username', 'reason')

class PromoCodeAdminForm(forms.ModelForm):
    valid_from = forms.DateTimeField(
        widget=forms.DateTimeInput(
            attrs={
                'type': 'datetime-local',
                'class': 'vDateTime',
                'style': 'width: 200px;'
            }
        ),
        initial=timezone.now,
        help_text='When the promo code becomes active'
    )
    valid_until = forms.DateTimeField(
        widget=forms.DateTimeInput(
            attrs={
                'type': 'datetime-local',
                'class': 'vDateTime',
                'style': 'width: 200px;'
            }
        ),
        initial=lambda: timezone.now() + timezone.timedelta(days=30),
        help_text='When the promo code expires'
    )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Format initial dates to work with datetime-local input
        if not self.is_bound:  # Only set if form is not bound (i.e., new form)
            self.initial['valid_from'] = timezone.localtime(timezone.now()).strftime('%Y-%m-%dT%H:%M')
            self.initial['valid_until'] = timezone.localtime(timezone.now() + timezone.timedelta(days=30)).strftime('%Y-%m-%dT%H:%M')

    class Meta:
        model = PromoCode
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        valid_from = cleaned_data.get('valid_from')
        valid_until = cleaned_data.get('valid_until')

        if valid_from and valid_until:
            if valid_until <= valid_from:
                raise forms.ValidationError({
                    'valid_until': 'Expiration date must be after start date'
                })
            
            # Ensure promo code is valid for at least 1 hour
            if (valid_until - valid_from).total_seconds() < 3600:
                raise forms.ValidationError({
                    'valid_until': 'Promo code must be valid for at least 1 hour'
                })
            
            # Add a validation warning if promo code is valid for more than 1 year
            if (valid_until - valid_from).days > 365:
                self.add_error(
                    'valid_until',
                    'Warning: This promo code will be valid for more than a year. Are you sure?'
                )

        return cleaned_data

@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    form = PromoCodeAdminForm
    list_display = ('code', 'discount_amount', 'is_percentage', 'is_active', 
                   'valid_from', 'valid_until', 'max_uses', 'current_uses', 'is_valid')
    list_filter = ('is_active', 'is_percentage')
    search_fields = ('code',)
    readonly_fields = ('code', 'current_uses', 'created_at')
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['valid_from'].widget.attrs['class'] = 'vDateField'
        form.base_fields['valid_until'].widget.attrs['class'] = 'vDateField'
        return form
    
    def get_fieldsets(self, request, obj=None):
        if obj:  # Editing an existing object
            return (
                ('Basic Information', {
                    'fields': ('code', 'discount_amount', 'is_percentage'),
                    'description': 'Promo code is auto-generated and cannot be changed.'
                }),
                ('Validity', {
                    'fields': ('is_active', 'valid_from', 'valid_until')
                }),
                ('Usage Limits', {
                    'fields': ('max_uses', 'current_uses')
                }),
                ('Metadata', {
                    'fields': ('created_at',)
                })
            )
        return (  # Adding a new object
            ('Basic Information', {
                'fields': ('discount_amount', 'is_percentage'),
                'description': 'A random promo code will be generated automatically.'
            }),
            ('Validity', {
                'fields': ('is_active', 'valid_from', 'valid_until')
            }),
            ('Usage Limits', {
                'fields': ('max_uses',)
            })
        )
