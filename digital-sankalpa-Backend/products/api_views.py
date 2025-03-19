from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def product_list(request):
    query = request.GET.get('query', '')
    products = Product.objects.filter(name__icontains=query) if query else Product.objects.all().order_by('-created_at')
    
    # Pagination: Show 9 products per page
    paginator = Paginator(products, 9)
    page_number = request.GET.get('page', 1)
    paginated_products = paginator.get_page(page_number)

    serializer = ProductSerializer(paginated_products, many=True)
    return Response({
        'products': serializer.data,
        'page': paginated_products.number,
        'total_pages': paginator.num_pages
    })

@api_view(['GET', 'POST'])
def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        rating = int(request.data.get('rating', 0))
        comment = request.data.get('comment', '')

        product.reviews.create(user=request.user, product=product, rating=rating, comment=comment)
        return Response({'message': 'Review added successfully'}, status=status.HTTP_201_CREATED)

    has_bought = request.user.is_authenticated and request.user.orders.filter(cart_items__product_id=product_id).exists()
    
    return Response({
        'product': ProductSerializer(product).data,
        'has_bought': has_bought
    })
