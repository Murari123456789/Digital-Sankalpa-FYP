import React, { useState, useEffect } from 'react';
import { getWishlist, removeFromWishlist } from '../api/wishlist';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';
import { useToast } from '../contexts/ToastContext';
import Popup from '../components/common/Popup';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart, isProductInCart } = useCart();
  const { showToast } = useToast();
  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlistItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      showToast('Failed to load wishlist', 'error');
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId, productName) => {
    setDeletePopup({
      isOpen: true,
      productId,
      productName
    });
  };

  const confirmDelete = async () => {
    try {
      await removeFromWishlist(deletePopup.productId);
      await fetchWishlist(); // Refresh the list
      // Dispatch custom event to notify wishlist changes
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      showToast(`${deletePopup.productName} removed from wishlist`, 'info');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showToast('Failed to remove from wishlist', 'error');
    } finally {
      setDeletePopup({ isOpen: false, productId: null, productName: '' });
    }
  };

  const cancelDelete = () => {
    setDeletePopup({ isOpen: false, productId: null, productName: '' });
  };

  const navigateToProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (productId, productName) => {
    try {
      const result = await addToCart(productId);
      if (result.success) {
        showToast(`${productName} added to cart!`, 'success');
      } else if (result.error === 'This item is already in your cart') {
        showToast('This item is already in your cart', 'info');
      } else {
        showToast(result.error || 'Failed to add item to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Popup
        isOpen={deletePopup.isOpen}
        onClose={cancelDelete}
        title="Remove from Wishlist"
        message={`Are you sure you want to remove ${deletePopup.productName} from your wishlist?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <FaHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center mr-4">
                  {item.product.image ? (
                    <img
                      src={`http://localhost:8000/${item.product.image}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">No image</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600"
                    onClick={() => navigateToProduct(item.product.id)}
                  >
                    {item.product.name}
                  </h3>
                  <div className="mb-2">
                    {item.product.is_on_sale && item.product.sale_percentage > 0 ? (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-600 line-through">Rs. {item.product.price}</p>
                        <p className="text-blue-600 font-bold">Rs. {item.product.sale_price}</p>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {item.product.sale_percentage}% OFF
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-600">Rs. {item.product.price}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleAddToCart(item.product.id, item.product.name)}
                  disabled={isProductInCart(item.product.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${isProductInCart(item.product.id) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                  title={isProductInCart(item.product.id) ? 'Already in cart' : 'Add to Cart'}
                >
                  <FaShoppingCart />
                  {isProductInCart(item.product.id) ? 'In Cart' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={() => handleRemoveFromWishlist(item.product.id, item.product.name)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove from wishlist"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
