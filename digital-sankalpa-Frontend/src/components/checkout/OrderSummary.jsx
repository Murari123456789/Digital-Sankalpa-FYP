import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api';

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
  pointDiscount,
  onPromoApplied,
  onUserDiscountChange
}) => {

  const [userDiscount, setUserDiscount] = useState(null);
  const [userDiscountAmount, setUserDiscountAmount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Fetch user's active discounts
  useEffect(() => {
    const fetchUserDiscounts = async () => {
      try {
        console.log('Fetching user discounts...');
        const response = await api.get('/api/discounts/discounts/user/');
        console.log('Discounts response:', response.data);
        const discounts = response.data.discounts;
        console.log('Found discounts:', discounts);
        if (discounts && discounts.length > 0) {
          // Get the highest discount if multiple exist
          const highestDiscount = discounts.reduce((prev, current) => {
            return (prev.discount_percentage > current.discount_percentage) ? prev : current;
          });
          setUserDiscount(highestDiscount);
          
          // Calculate discount amount
          const discountAmount = (totalCost * highestDiscount.discount_percentage) / 100;
          console.log('Calculated discount amount:', discountAmount, 'from percentage:', highestDiscount.discount_percentage);
          setUserDiscountAmount(discountAmount);
          
          // Notify parent component of the discount amount
          if (onUserDiscountChange) {
            onUserDiscountChange(discountAmount);
          }
        } else {
          // Reset discount if no active discounts
          setUserDiscount(null);
          setUserDiscountAmount(0);
          if (onUserDiscountChange) {
            onUserDiscountChange(0);
          }
        }
      } catch (error) {
        console.error('Error fetching user discounts:', error);
      }
    };

    fetchUserDiscounts();
  }, [totalCost]);

  const handleApplyPromo = async () => {
    try {
      setPromoError('');
      const response = await api.post('/api/discounts/promocodes/apply/', {
        code: promoCode,
        order_total: totalCost - pointDiscount
      });


      if (response.data.valid) {
        setPromoDiscount(response.data.discount_amount);
        setAppliedPromo(promoCode);
        setPromoCode('');
        if (onPromoApplied) {
          onPromoApplied(response.data.discount_amount);
        }
      }
    } catch (error) {
      setPromoError(error.response?.data?.message || 'Failed to apply promo code');
    }
  };
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

        {/* Promo Code Section */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col space-y-2">
            {!appliedPromo ? (
              <>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="form-input flex-1 text-sm"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs">{promoError}</p>
                )}
              </>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Applied: {appliedPromo}</span>
                <button
                  onClick={() => {
                    setAppliedPromo(null);
                    setPromoDiscount(0);
                    if (onPromoApplied) onPromoApplied(0);
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Display all discounts in order */}
        {pointDiscount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Points Discount</span>
            <span>- Rs. {pointDiscount}</span>
          </div>
        )}

        {userDiscount && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Personal Discount ({userDiscount.discount_percentage}%)</span>
            <span>- Rs. {userDiscountAmount.toFixed(2)}</span>
          </div>
        )}

        {promoDiscount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Promo Discount</span>
            <span>- Rs. {promoDiscount}</span>
          </div>
        )}

        {/* Total after all discounts */}
        <div className="flex justify-between py-2 border-t border-b mb-4">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">
            Rs. {Math.max(0, totalCost - pointDiscount - promoDiscount - userDiscountAmount).toFixed(2)}
          </span>
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