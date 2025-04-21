from django.contrib import admin
from .models import Product


admin.site.site_header = 'E-Commerce Admin'
admin.site.site_title = 'E-Commerce Admin'
admin.site.index_title = 'E-Commerce Admin'

admin.site.register(Product)
