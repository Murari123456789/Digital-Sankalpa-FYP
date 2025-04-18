import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getProductById, addProductReview } from '../api/products';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import ProductReview from '../components/products/ProductReview';
import Loading from '../components/common/Loading';

// Add these to your API functions
const addToWishlist = async (productId) => {
  try {
    const response = await fetch('/api/wishlist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to wishlist');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const removeFromWishlist = async (productId) => {
  try {
    const response = await fetch(`/api/wishlist/remove/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove from wishlist');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const getWishlist = async () => {
  try {
    const response = await fetch('/api/wishlist', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, isAuthenticated } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  
  // Add state for wishlist
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // Add state for active tab
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data.product);
        setReviews(data.reviews || []);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user && product) {
        try {
          const wishlistItems = await getWishlist();
          const inWishlist = wishlistItems.some(item => item.product.id === product.id);
          setIsInWishlist(inWishlist);
        } catch (err) {
          console.error('Error checking wishlist status:', err);
        }
      }
    };
    
    if (user && product) {
      checkWishlistStatus();
    }
  }, [user, product]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = async () => {
    if(!isAuthenticated) {
      navigate('/login', { 
        state: { from: location.pathname } 
      });
      return;
    }
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product.id);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };
  
  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: location.pathname } 
      });
      return;
    }
    
    try {
      setWishlistLoading(true);
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        setIsInWishlist(false);
      } else {
        await addToWishlist(product.id);
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  };
  
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value,
    }));
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitReviewLoading(true);
      setReviewError(null);
      
      await addProductReview(id, reviewFormData);
      
      // Refetch product to get updated reviews
      const data = await getProductById(id);
      setReviews(data.reviews || []);
      
      // Reset form
      setReviewFormData({
        rating: 5,
        comment: '',
      });
      setShowReviewForm(false);
    } catch (err) {
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setSubmitReviewLoading(false);
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Product not found'}</p>
            </div>
          </div>
        </div>
        <Link to="/products" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/products" className="ml-1 text-gray-600 hover:text-blue-500 transition-colors duration-200 md:ml-2">
                Products
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-gray-500 md:ml-2">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>
      
      {/* Product Info Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 p-8">
            <div className="bg-gray-50 rounded-lg h-96 flex items-center justify-center border border-gray-100">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain p-4"
                />
              ) : (
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500">Product image not available</span>
                </div>
              )}
            </div>

            {/* Image thumbnails - would be populated with real thumbnails */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`h-16 rounded cursor-pointer bg-gray-100 border ${i === 1 ? 'border-blue-500' : 'border-gray-200'} flex items-center justify-center`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={`Thumbnail ${i}`}
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Image {i}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-8 bg-white">
            <h1 className="text-3xl font-bold mb-3 text-gray-800">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              {/* Display average rating stars */}
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      product.avg_rating >= star
                        ? 'text-yellow-400'
                        : product.avg_rating >= star - 0.5
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.avg_rating ? 
                  `${product.avg_rating.toFixed(1)} (${product.review_count || 0} reviews)` : 
                  'No reviews yet'}
              </span>
              {product.review_count > 0 && (
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className="ml-3 text-blue-500 text-sm hover:underline"
                >
                  Read Reviews
                </button>
              )}
            </div>
            
            <div className="mb-6">
              {product.compare_at_price ? (
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-600">Rs. {product.price}</span>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    Rs. {product.compare_at_price}
                  </span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Save {Math.round((1 - product.price / product.compare_at_price) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-blue-600">Rs. {product.price}</span>
              )}
            </div>
            
            <div className="border-t border-b border-gray-100 py-4 mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Product options */}
            <div className="space-y-6 mb-8">
              {/* Stock status */}
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-green-600 font-medium">In Stock</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-600">Usually ships within 24 hours</span>
              </div>
              
              {/* Quantity Selector */}
              <div>
                <div className="flex items-center">
                  <label htmlFor="quantity" className="mr-3 font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`py-3 px-6 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center ${
                  isInWishlist 
                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {wishlistLoading ? (
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 mr-2 ${isInWishlist ? "fill-current" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
        <div className="border-b">
          <nav className="flex">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              } transition-colors duration-200`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('specifications')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'specifications'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              } transition-colors duration-200`}
            >
              Specifications
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              } transition-colors duration-200`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>{product.description || 'No detailed description available.'}</p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">Technical Details</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">{product.weight || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Dimensions</span>
                      <span className="font-medium">{product.dimensions || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Material</span>
                      <span className="font-medium">{product.material || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Country of Origin</span>
                      <span className="font-medium">{product.country_of_origin || 'N/A'}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">Product Information</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-medium">{product.brand || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Model</span>
                      <span className="font-medium">{product.model || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">SKU</span>
                      <span className="font-medium">{product.sku || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Warranty</span>
                      <span className="font-medium">{product.warranty || '1 year'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                
                {user && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Write a Review
                  </button>
                )}
              </div>
              
              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-8 border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  
                  {reviewError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">{reviewError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Your Rating</label>
                      <div className="flex items-center">
                        {[5, 4, 3, 2, 1].map((value) => (
                          <label key={value} className="mr-4 cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              value={value}
                              checked={reviewFormData.rating === value}
                              onChange={handleReviewChange}
                              className="sr-only"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-8 w-8 transition-colors duration-200 ${
                                reviewFormData.rating >= value
                                  ? 'text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-300'
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">Your Review</label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Share your experience with this product..."
                        value={reviewFormData.comment}
                        onChange={handleReviewChange}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        disabled={submitReviewLoading}
                      >
                        {submitReviewLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="bg-gray-50 text-center py-12 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
                  {user ? (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Write a Review
                    </button>
                  ) : (
                    <Link 
                      to="/login" 
                      state={{ from: location.pathname }}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Sign in to Write a Review
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ProductReview key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium">
            View All Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would be populated with actual related products */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="relative">
                <div className="h-56 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors duration-200">Related Product {i}</h3>
                <div className="flex text-yellow-400 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-4 w-4" fill={star <= 4 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-xs text-gray-500">(24)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-blue-600">Rs. 199.99</p>
                  {i % 2 === 0 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Sale</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <Link to={`/products/${i}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </Link>
                  <button className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;