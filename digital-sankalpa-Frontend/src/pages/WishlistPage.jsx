import React, { useState, useEffect } from 'react';
import { getWishlist, removeFromWishlist } from '../api/wishlist';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
      toast.error('Failed to load wishlist');
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
      fetchWishlist(); // Refresh the list
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const navigateToProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
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
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FaHeart className="text-red-500 mr-2" />
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => navigateToProduct(item.product.id)}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item.product.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="p-4">
                <h3
                  className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-500"
                  onClick={() => navigateToProduct(item.product.id)}
                >
                  {item.product.name}
                </h3>
                <p className="text-gray-600 mb-2">{item.product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">
                    ${item.product.price}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item.product.id)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                      title="Add to Cart"
                    >
                      <FaShoppingCart />
                    </button>
                    <button
                      onClick={() => navigateToProduct(item.product.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
