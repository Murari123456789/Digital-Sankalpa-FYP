import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify'; // If you're using toast notifications

const ProductCard = ({ product }) => {
  const { addToCart, isAuthenticated } = useCart(); // Remove 'loading' from here
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = async (e) => {
    console.log(isAuthenticated)
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
          {product.is_on_sale && product.sale_percentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SALE {product.sale_percentage}% OFF
            </div>
          )}
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
          <Link 
            to={`/products/${product.id}`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 disabled:bg-blue-300"
            aria-label="Add to cart"
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