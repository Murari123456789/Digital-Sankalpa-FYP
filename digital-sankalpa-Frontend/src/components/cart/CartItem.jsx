import { Link } from 'react-router-dom';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value, 10);
    if (newQty >= 1) {
      onUpdateQuantity(newQty);
    }
  };
  
  return (
    <div className="grid grid-cols-12 gap-4 p-4 border-b items-center">
      <div className="col-span-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
            {item && item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-xs">No image</span>
            )}
          </div>
          <div>
            <Link
              to={`/products/${item.id}`}
              className="font-medium text-gray-800 hover:text-blue-600"
            >
              {item.name}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="col-span-2 text-center">
        ${item.price}
      </div>
      
      <div className="col-span-2 text-center">
        <div className="flex items-center justify-center">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="w-8 h-8 border rounded-l flex items-center justify-center text-gray-600 hover:bg-gray-100"
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
          />
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-8 h-8 border rounded-r flex items-center justify-center text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="col-span-2 text-right font-medium">
        ${item.total_price}
        <button
          onClick={onRemove}
          className="ml-3 text-red-500 hover:text-red-700"
          aria-label="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;