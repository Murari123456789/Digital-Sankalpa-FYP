from django.contrib import admin
from .models import Product


admin.site.site_header = 'E-Commerce Admin'
admin.site.site_title = 'E-Commerce Admin'
admin.site.index_title = 'E-Commerce Admin'

class ProductAdmin(admin.ModelAdmin):
    search_fields = ['name', 'description', 'category']

admin.site.register(Product, ProductAdmin)
