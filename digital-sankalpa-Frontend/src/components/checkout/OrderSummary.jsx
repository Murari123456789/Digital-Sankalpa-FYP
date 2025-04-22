import { Link } from 'react-router-dom';

const OrderSummary = ({ 
  cartItems, 
  subtotal, 
  shippingCost, 
  totalCost,
  usePoints,
  setUsePoints,
  pointsToRedeem,
  setPointsToRedeem,
  maxPointsAllowed,
  handlePointsChange,
  pointDiscount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="max-h-60 overflow-y-auto mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <div className="pr-2">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
            </div>
            <div className="font-medium">Rs. {item.total_price}</div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span>Rs. {subtotal }</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span>{shippingCost > 0 ? `Rs. ${shippingCost }` : 'Free'}</span>
        </div>
        {/* Points Redemption Section */}
        {maxPointsAllowed > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={(e) => {
                    setUsePoints(e.target.checked);
                    if (!e.target.checked) setPointsToRedeem(0);
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Use Reward Points</span>
              </label>
              <span className="text-sm text-gray-600">{maxPointsAllowed} points available</span>
            </div>
            
            {usePoints && (
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    type="number"
                    value={pointsToRedeem}
                    onChange={handlePointsChange}
                    min="0"
                    max={maxPointsAllowed}
                    className="form-input w-full text-sm"
                    placeholder="Enter points to redeem"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">10 points = Rs. 1 discount</p>
              </div>
            )}
          </div>
        )}

        {/* Points Discount */}
        {pointDiscount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Points Discount</span>
            <span>- Rs. {pointDiscount}</span>
          </div>
        )}

        <div className="flex justify-between py-2 border-t border-b mb-4">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">Rs. {totalCost - pointDiscount}</span>
        </div>
      </div>
      
      <Link to="/cart" className="text-blue-500 text-sm hover:underline flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Cart
      </Link>
    </div>
  );
};

export default OrderSummary;