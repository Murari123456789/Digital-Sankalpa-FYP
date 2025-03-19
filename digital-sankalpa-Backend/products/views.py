from django.shortcuts import render, get_object_or_404,redirect
from .models import Product
from django.core.paginator import Paginator


def product_list(request):
    query = request.GET.get('query', '')
    products = Product.objects.filter(name__icontains=query) if query else Product.objects.all().order_by('-created_at')
    paginator = Paginator(products, 9)  # Show 10 products per page.
    page_number = request.GET.get('page')
    paginated_products = paginator.get_page(page_number)
    return render(request, 'products/product_list.html', {'products': paginated_products, 'query': query})



def product_detail(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, id=product_id)
        rating = int(request.POST.get('rating'))
        comment = request.POST.get('comment')
        product.reviews.create(user=request.user,product=product, rating=rating, comment=comment)
        return redirect('product_detail', product_id=product_id)
    has_bought = False
    if request.user.is_authenticated:
        if request.user.orders.filter(cart_items__product_id=product_id).exists():
            has_bought = True
    product = get_object_or_404(Product, id=product_id)
    
    context = {
        'product': product,
        'has_bought': has_bought
    }
    return render(request, 'products/product_details.html', context)
