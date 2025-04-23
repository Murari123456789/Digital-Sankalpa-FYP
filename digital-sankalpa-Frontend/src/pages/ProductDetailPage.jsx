import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getProductDetails } from '../api/products';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth.jsx';
import { addToWishlist, removeFromWishlist } from '../api/wishlist';
import { createReview, deleteReview } from '../api/reviews';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import api from '../api/api';
import ProductReview from '../components/products/ProductReview';
import Loading from '../components/common/Loading';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import { FaInstagram, FaCopy, FaCheck } from 'react-icons/fa';

// Helper function to get complete image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseUrl}${imagePath}`;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, isProductInCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userReview, setUserReview] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetails(id);
        setProduct(data.product);
        setIsInWishlist(data.is_in_wishlist);
        setRelatedProducts(data.related_products);
        setReviews(data.product.reviews || []);
        setUserReview(data.user_review);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update cart status whenever product or cart items change
  useEffect(() => {
    if (user && product) {
      setIsInCart(isProductInCart(product.id));
    } else {
      setIsInCart(false);
    }
  }, [user, product, isProductInCart]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) {
        setIsInWishlist(false);
        return;
      }

      try {
        const response = await api.get('/api/products/wishlist/');
        const isInList = response.data.some(item => item.product.id === parseInt(id));
        setIsInWishlist(isInList);
      } catch (error) {
        if (error.response?.status === 401) {
          // User is not authenticated, just set wishlist to false
          setIsInWishlist(false);
        } else {
          console.error('Error checking wishlist status:', error);
          setIsInWishlist(false);
        }
      }
    };

    checkWishlistStatus();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (product.stock === 0) {
      showToast('Sorry, this product is out of stock', 'error');
      return;
    }

    if (isInCart) {
      showToast('This item is already in your cart. You can update the quantity in the cart.', 'info');
      return;
    }

    try {
      const result = await addToCart(product.id);
      if (result.success) {
        showToast(`${product.name} has been added to your cart!`);
        setIsInCart(true);
      } else if (result.requiresAuth) {
        navigate('/login', { state: { from: location.pathname } });
      } else if (result.error === 'This item is already in your cart') {
        setIsInCart(true);
        showToast('This item is already in your cart. You can update the quantity in the cart.', 'info');
      } else {
        showToast(result.error || 'Failed to add to cart', 'error');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) return;

    try {
      await deleteReview(reviewId);
      const data = await getProductDetails(id);
      setProduct(data.product);
      setReviews(data.product.reviews || []);
      if (data.user_review) {
        setUserReview(data.user_review);
      }
      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setWishlistLoading(true);
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
      // Dispatch custom event to notify wishlist changes
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await createReview(id, {
        rating,
        comment
      });
      
      // Update reviews list
      const data = await getProductDetails(id);
      setProduct(data.product);
      setReviews(data.product.reviews || []);
      if (data.user_review) {
        setUserReview(data.user_review);
      }
      setRating(5);
      setComment('');
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Failed to submit review');
      } else if (error.response?.status === 401) {
        toast.error('Please log in to submit a review');
        navigate('/login');
      } else {
        toast.error('An error occurred while submitting your review');
      }
    } finally {
      setSubmittingReview(false);
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
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || 'Product not found'}
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/products"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
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
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Link
                to="/products"
                className="ml-1 text-gray-600 hover:text-blue-500 transition-colors duration-200 md:ml-2"
              >
                Products
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
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
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain p-4"
                />
              ) : (
                <div className="text-center p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-500">
                    Product image not available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8 bg-white">
            <h1 className="text-3xl font-bold mb-3 text-gray-800">
              {product.name}
            </h1>



            <div className="mb-6">
              {product.is_on_sale && product.sale_percentage > 0 ? (
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">
                      Rs. {product.sale_price}
                    </span>
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      Rs. {product.price}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {product.sale_percentage}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  Rs. {product.price}
                </span>
              )}
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${star <= product.average_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.average_rating ? product.average_rating.toFixed(1) : '0.0'} ({product.total_reviews || 0} {product.total_reviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 py-4 mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Social Media Sharing */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Share this product:</p>
              <div className="flex space-x-4 items-center">
                {/* Facebook Share */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${location.pathname}`;
                    const shareText = `Check out ${product.name} on Digital Sankalpa! Price: Rs. ${product.is_on_sale ? product.sale_price : product.price}`;
                    const fbUrl = `https://www.facebook.com/share.php?u=${encodeURIComponent(shareUrl)}`;
                    window.open(fbUrl, '_blank', 'width=600,height=400');
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <FacebookIcon size={32} round />
                </button>

                {/* Twitter Share */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${location.pathname}`;
                    const shareText = `Check out ${product.name} on Digital Sankalpa! Price: Rs. ${product.is_on_sale ? product.sale_price : product.price}`;
                    const twitterUrl = `https://twitter.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                    window.open(twitterUrl, '_blank', 'width=600,height=400');
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <TwitterIcon size={32} round />
                </button>

                {/* WhatsApp Share */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${location.pathname}`;
                    const shareText = `Check out ${product.name} on Digital Sankalpa! Price: Rs. ${product.is_on_sale ? product.sale_price : product.price}`;
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const whatsappUrl = isMobile
                      ? `whatsapp://send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
                      : `https://web.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <WhatsappIcon size={32} round />
                </button>

                {/* Instagram Share */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${location.pathname}`;
                    const shareText = `Check out ${product.name} on Digital Sankalpa! Price: Rs. ${product.is_on_sale ? product.sale_price : product.price}`;
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    
                    // Copy content to clipboard
                    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
                      // Try to open Instagram based on device
                      if (isMobile) {
                        // For mobile devices, try to open the Instagram app
                        window.location.href = 'instagram://camera';
                        
                        // Fallback to Instagram website after a short delay if app doesn't open
                        setTimeout(() => {
                          window.location.href = 'https://www.instagram.com';
                        }, 2000);
                      } else {
                        // For desktop, open Instagram website
                        window.open('https://www.instagram.com', '_blank');
                      }
                      
                      toast.success('Content copied! Opening Instagram...');
                    });
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 hover:opacity-80 transition-opacity"
                  title="Share on Instagram"
                >
                  <FaInstagram className="text-white text-lg" />
                </button>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {/* Product Status Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Stock Status */}
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 ${product?.stock === 0 ? 'bg-red-500' : 'bg-green-500'} rounded-full mr-2`}></span>
                    <span className={`${product?.stock === 0 ? 'text-red-600' : 'text-green-600'} font-medium`}>
                      {product?.stock === 0 ? 'Out of Stock' : 'In Stock'}
                    </span>
                  </div>

                  {/* Separator */}
                  <span className="text-gray-300">|</span>

                  {/* Available Units */}
                  <span className="text-gray-600 font-medium">
                    {product?.stock} units available
                  </span>

                  {/* Cart Status */}
                  {isInCart && (
                    <>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-blue-600 font-medium">In Your Cart</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product?.stock === 0 || isInCart}
                  className={`flex-1 py-3 px-6 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center
                    ${product?.stock === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                      : isInCart
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 hover:shadow-md'}`}
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
                  {product?.stock === 0 ? 'Out of Stock' : isInCart ? 'In Your Cart' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`py-3 px-6 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center ${
                    isInWishlist
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {wishlistLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 mr-2 ${
                          isInWishlist ? 'fill-current' : ''
                        }`}
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
                      {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
        <h2 className="text-2xl font-bold p-6 border-b">Customer Reviews</h2>
        
        {/* Review Statistics */}
        <div className="p-6">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <div className="text-4xl font-bold mr-2">
                    {product.average_rating ? product.average_rating.toFixed(1) : '0.0'}
                  </div>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`h-5 w-5 ${star <= product.average_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mt-1">
                  {product.total_reviews || 0} {product.total_reviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          {user && !userReview && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-gray-700 mb-2">
                    Review
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Share your thoughts about this product..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {userReview && (
              <ProductReview 
                review={userReview} 
                currentUser={user} 
                onDelete={() => handleDeleteReview(userReview.id)}
              />
            )}
            {reviews
              .filter(review => !user || review.user_id !== user.id)
              .map(review => (
                <ProductReview 
                  key={review.id} 
                  review={review} 
                  currentUser={user}
                />
              ))}
            {reviews.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Products
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 duration-300"
              >
                <div className="relative">
                  <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {relatedProduct.image ? (
                      <img
                        src={getImageUrl(relatedProduct.image)}
                        alt={relatedProduct.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/products/${relatedProduct.id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors duration-200">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-4">
                    {relatedProduct.is_on_sale && relatedProduct.sale_percentage > 0 ? (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-600 line-through">Rs. {relatedProduct.price}</p>
                        <p className="text-blue-600 font-bold">Rs. {relatedProduct.sale_price}</p>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {relatedProduct.sale_percentage}% OFF
                        </span>
                      </div>
                    ) : (
                      <p className="font-bold text-blue-600">Rs. {relatedProduct.price}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/products/${relatedProduct.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(relatedProduct.id)}
                      className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
