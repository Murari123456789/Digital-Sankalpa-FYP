import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import Loading from '../components/common/Loading';
import { usePopup } from '../contexts/PopupContext';
import { useToast } from '../contexts/ToastContext';

const CartPage = () => {
  const { cartItems, loading, error, removeFromCart, updateCartItem } = useCart();
  const { showPopup } = usePopup();
  const { showToast } = useToast();

  const handleRemoveItem = (item) => {
    showPopup({
      title: 'Remove Item',
      message: `Are you sure you want to remove ${item.product_name} from your cart?`,
      onConfirm: () => {
        removeFromCart(item.id);
        showToast(`${item.product_name} has been removed from your cart`);
      },
      onCancel: () => {},
    });
  };
  
  if (loading) {
    return <Loading />;
  }
  
  // Calculate totals
  const calculateTotals = () => {
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { itemCount, subtotal };
  };

  const { subtotal, itemCount } = calculateTotals();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  
  // Show empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-8/12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="p-4 bg-gray-50 border-b">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
            </div>
            
            <div className="flex flex-col">
              {[...cartItems]
                .sort((a, b) => a.product_name.localeCompare(b.product_name))
                .map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onUpdateQuantity={(quantity) => updateCartItem(item.id, quantity)}
                    onRemove={() => handleRemoveItem(item)}
                  />
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Link to="/products" className="text-blue-500 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
            
            <Link to="/products" className="text-gray-600 hover:text-gray-800">
              Browse More Products
            </Link>
          </div>
        </div>
        
        <div className="lg:w-4/12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs. {subtotal }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping > 0 ? `Rs. ${shipping }` : 'Free'}</span>
              </div>
            </div>
            
            <div className="flex justify-between mb-6">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">Rs. {total }</span>
            </div>
            
            <Link 
              to="/checkout" 
              className="block w-full text-center btn-primary"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;