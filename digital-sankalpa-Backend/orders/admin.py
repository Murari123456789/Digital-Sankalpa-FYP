from django.contrib import admin
from django.db.models import F
from .models import Order, CartItem
from products.models import Product

class OrderAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'user', 'total_price', 'payment_status', 'created_at']
    list_filter = ['payment_status', 'created_at']
    search_fields = ['uuid', 'user__username']
    readonly_fields = ['uuid', 'total_price', 'final_price', 'created_at']

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

        super().save_model(request, obj, form, change)

admin.site.register(Order, OrderAdmin)
admin.site.register(CartItem)
