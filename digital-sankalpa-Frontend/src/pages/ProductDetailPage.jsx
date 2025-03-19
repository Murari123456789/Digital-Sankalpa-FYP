import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, addProductReview } from '../api/products';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import ProductReview from '../components/products/ProductReview';
import Loading from '../components/common/Loading';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, isAuthenticated } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate()
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
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = async () => {
    // Call addToCart multiple times based on quantity
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
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-500">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/products" className="ml-1 text-gray-600 hover:text-blue-500 md:ml-2">
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
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 p-6">
            <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-500">Product image not available</span>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
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
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">${product.price }</span>
              {product.compare_at_price && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  ${product.compare_at_price }
                </span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="quantity" className="mr-3 font-medium">
                  Quantity:
                </label>
                <div className="flex">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-10 h-10 border border-gray-300 rounded-l flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 h-10 border-t border-b text-center focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-r flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center"
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
                className="btn-secondary flex items-center justify-center"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="border-b">
          <nav className="flex">
            <button className="px-6 py-3 border-b-2 border-blue-500 font-medium text-blue-600">
              Description
            </button>
            <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">
              Specifications
            </button>
            <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="prose max-w-none">
            <p>{product.description || 'No detailed description available.'}</p>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Customer Reviews</h2>
            
            {user && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary"
              >
                Write a Review
              </button>
            )}
          </div>
          
          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              
              {reviewError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {reviewError}
                </div>
              )}
              
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label htmlFor="rating" className="form-label">Rating</label>
                  <div className="flex">
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
                          className={`h-8 w-8 ${
                            reviewFormData.rating >= value
                              ? 'text-yellow-400'
                              : 'text-gray-300'
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
                
                <div className="mb-4">
                  <label htmlFor="comment" className="form-label">Review</label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    className="input-field"
                    placeholder="Share your experience with this product..."
                    value={reviewFormData.comment}
                    onChange={handleReviewChange}
                    required
                  ></textarea>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitReviewLoading}
                  >
                    {submitReviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ProductReview key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products Section */}
      <div>
        <h2 className="text-xl font-bold mb-6">Related Products</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* This would be populated with actual related products */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Related Product {i}</h3>
                <p className="text-gray-600 mb-4">$199.99</p>
                <div className="flex justify-between items-center">
                  <Link to="#" className="text-blue-500 hover:underline">View Details</Link>
                  <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600">
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