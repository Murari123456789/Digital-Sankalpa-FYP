import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth.jsx';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentMethod from '../components/checkout/PaymentMethod';
import EsewaPayment from '../components/checkout/EsewaPayment';
import Loading from '../components/common/Loading';

const CheckoutPage = () => {
  const { cartItems, getCartTotals, checkout, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [usePoints, setUsePoints] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const maxPointsAllowed = Math.min(user?.points || 0, Math.floor(getCartTotals().total * 10)); // 10 points = 1 Rs
  
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [order, setOrder] = useState(null);
  const [paymentForm, setPaymentForm] = useState(null);

  const [checkoutStep, setCheckoutStep] = useState('information'); // 'information', 'payment', 'processing'
  const [error, setError] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [userDiscountAmount, setUserDiscountAmount] = useState(0);
  
  // Redirect to cart if it's empty
  if (!loading && cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const calculatePointDiscount = () => {
    if (usePoints && pointsToRedeem) {
      return pointsToRedeem / 10; // Convert points to Rs (10 points = 1 Rs)
    }
    return 0;
  };

  const calculateTotalDiscount = () => {
    return calculatePointDiscount() + promoDiscount + userDiscountAmount;
  };

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= maxPointsAllowed) {
      setPointsToRedeem(value);
    }
  };

  const handlePromoApplied = (amount) => {
    setPromoDiscount(amount);
  };

  const handleInformationSubmit = (e) => {
    e.preventDefault();
    // Validate shipping information
    // ...
    setCheckoutStep('payment');
  };
  
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setCheckoutStep('processing');
    setError(null);
    
    try {
      // Include points redemption in checkout
      const pointDiscount = calculatePointDiscount();
      const result = await checkout(shippingInfo, paymentMethod, usePoints ? pointsToRedeem : 0, promoDiscount, userDiscountAmount);

      if (result.success) {
        setOrder(result.data.order);
        setPaymentForm(result.data.payment_form);
        
        // If payment method is COD, redirect to success page
        if (paymentMethod === 'cod') {
          navigate(`/order-success/${result.data.order.id}`);
        }
        // For Esewa, we'll show the payment form
      } else {
        setError(result.error);
        setCheckoutStep('payment');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setCheckoutStep('payment');
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  const { subtotal } = getCartTotals();
  const shippingCost = 0; // Free shipping
  const totalCost = subtotal + shippingCost;
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Checkout Form */}
        <div className="md:w-2/3">
          {checkoutStep === 'information' && (
            <CheckoutForm 
              shippingInfo={shippingInfo}
              onChange={handleShippingInfoChange}
              onSubmit={handleInformationSubmit}
            />
          )}
          
          {checkoutStep === 'payment' && (
            <PaymentMethod 
              selectedMethod={paymentMethod}
              onChange={handlePaymentMethodChange}
              onSubmit={handlePaymentSubmit}
              onBack={() => setCheckoutStep('information')}
            />
          )}
          
          {checkoutStep === 'processing' && paymentMethod === 'esewa' && (
            <EsewaPayment 
              order={order} 
              paymentForm={paymentForm}
            />
          )}
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="md:w-1/3">
          <OrderSummary 
            cartItems={cartItems} 
            subtotal={subtotal}
            shippingCost={shippingCost}
            totalCost={totalCost}
            usePoints={usePoints}
            setUsePoints={setUsePoints}
            pointsToRedeem={pointsToRedeem}
            setPointsToRedeem={setPointsToRedeem}
            maxPointsAllowed={maxPointsAllowed}
            handlePointsChange={handlePointsChange}
            pointDiscount={calculatePointDiscount()}
            onUserDiscountChange={setUserDiscountAmount}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;