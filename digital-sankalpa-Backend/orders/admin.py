from django.contrib import admin
from django.db.models import F
from .models import Order
from products.models import Product

class OrderAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'user', 'total_price', 'payment_status', 'created_at']
    list_filter = ['payment_status', 'created_at']
    search_fields = ['uuid', 'user__username']
    readonly_fields = ['uuid', 'total_price', 'final_price', 'created_at', 'cart_items_display']
    
    def cart_items_display(self, obj):
        from django.utils.html import format_html
        from django.utils.safestring import mark_safe
        
        items = []
        for item in obj.cart_items.all():
            items.append(
                f'<div style="margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">' 
                f'<strong>{item.product.name}</strong><br>' 
                f'Quantity: {item.quantity}<br>' 
                f'Price: Rs. {item.product.price}<br>' 
                f'Total: Rs. {item.quantity * item.product.price}' 
                f'</div>'
            )
        return format_html('<div style="max-width: 400px;">{}</div>', mark_safe(''.join(items)))
    
    cart_items_display.short_description = 'Cart Items'
    
    fieldsets = [
        ('Order Information', {
            'fields': ['uuid', 'user', 'payment_status', 'created_at']
        }),
        ('Cart Items', {
            'fields': ['cart_items_display']
        }),
        ('Price Details', {
            'fields': ['total_price', 'discount', 'points_redeemed', 'point_discount', 'final_price']
        })
    ]

    def save_model(self, request, obj, form, change):
        if change:  # Only for existing objects
            old_obj = Order.objects.get(pk=obj.pk)
            # If payment status is changed to completed
            if old_obj.payment_status != 'completed' and obj.payment_status == 'completed':
                # Reduce stock for each cart item
                for cart_item in obj.cart_items.all():
                    product = cart_item.product
                    # Update product stock
                    product.stock -= cart_item.quantity
                    product.save()
                    
                    # Deactivate cart item
                    cart_item.active = False
                    cart_item.save()
                
                # Calculate and award points (1 point per Rs. 10 spent)
                points_to_award = int(float(obj.total_price) // 10)
                if points_to_award > 0:
                    obj.user.points += points_to_award
                    obj.user.save()

        super().save_model(request, obj, form, change)

admin.site.register(Order, OrderAdmin)
