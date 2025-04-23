import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart, isAuthenticated, isProductInCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (isAuthenticated && product) {
      setIsInCart(isProductInCart(product.id));
    } else {
      setIsInCart(false);
    }
  }, [isAuthenticated, product, isProductInCart]);
  
  const handleAddToCart = async (e) => {
    // Check if product is out of stock
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock');
      return;
    }

    // If not logged in, redirect to login
    if (!isAuthenticated) {
      // Save current page to redirect back after login
      navigate('/login', { 
        state: { from: location.pathname } 
      });
      return;
    }
    
    setIsAdding(true);
    try {
      const result = await addToCart(product.id);
      
      if (result.success) {
        // Show success message
        toast?.success(result.message || 'Item added to cart');
      } else {
        // Show error message
        toast?.error(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      toast?.error('An error occurred while adding to cart');
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px]">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 bg-gray-200 flex items-center justify-center relative">
          {/* Badge container */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Sale badge */}
            {product.is_on_sale && product.sale_percentage > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                SALE {product.sale_percentage}% OFF
              </div>
            )}
            {/* Out of stock badge */}
            {product.stock === 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                OUT OF STOCK
              </div>
            )}
          </div>
          {product.image ? (
            <img 
              src={`http://localhost:8000/${product.image}`} 
              alt={product.name} 
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-500">No image</span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">{product.name}</h3>
        </Link>
        <div className="mb-4">
          {product.is_on_sale && product.sale_percentage > 0 ? (
            <div className="flex items-center gap-2">
              <p className="text-gray-600 line-through">Rs. {product.price}</p>
              <p className="text-blue-600 font-bold">Rs. {product.sale_price}</p>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Save Rs. {product.price - product.sale_price}
              </span>
            </div>
          ) : (
            <p className="text-gray-600">Rs. {product.price}</p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link 
              to={`/products/${product.id}`}
              className="text-blue-500 hover:underline"
            >
              View Details
            </Link>
            {product.stock > 0 && (
              <span className="text-sm text-green-600">
                In Stock
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0 || isInCart}
            className={`rounded-full w-8 h-8 flex items-center justify-center ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : isInCart ? 'bg-blue-200 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'} text-white`}
            aria-label={isInCart ? 'Already in cart' : 'Add to cart'}
            title={product.stock === 0 ? 'Out of stock' : isInCart ? 'Already in cart' : 'Add to cart'}
          >
            {isAdding ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;