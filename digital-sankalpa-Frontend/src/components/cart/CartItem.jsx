import { Link } from 'react-router-dom';

// Helper function to get complete image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseUrl}${imagePath}`;
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (e) => {
    e.preventDefault();
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty >= 1) {
      onUpdateQuantity(newQty);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdateQuantity(item.quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };
  
  return (
    <div className="grid grid-cols-12 gap-4 p-4 border-b items-center">
      <div className="col-span-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
            {item && item.image ? (
              <img
                src={getImageUrl(item.image)}
                alt={item.product_name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <span className="text-gray-500 text-xs">No image</span>
            )}
          </div>
          <div className="ml-4">
            <Link
              to={`/products/${item.id}`}
              className="font-medium text-gray-800 hover:text-blue-600"
            >
              {item.product_name}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="col-span-2 text-center">
        Rs. {item.price}
      </div>
      
      <div className="col-span-2 text-center">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-8 h-8 border rounded-l flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-12 h-8 border-t border-b text-center focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
              }
            }}
          />
          <button
            type="button"
            onClick={handleIncrement}
            className="w-8 h-8 border rounded-r flex items-center justify-center text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="col-span-2 text-right font-medium">
        Rs. {item.price * item.quantity}
        <button
          onClick={onRemove}
          className="ml-3 text-red-500 hover:text-red-700"
          aria-label="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;