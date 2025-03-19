import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const EsewaPayment = ({ order, paymentForm }) => {
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set loading to false once we have both the order and payment form
    if (order && paymentForm) {
      setIsLoading(false);
      
      // Auto-submit form after a short delay
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 1000);
    }
  }, [order, paymentForm]);

  // Handle cancellation
  const handleCancel = () => {
    navigate('/cart');
  };

  // If still loading, show loading spinner
  if (isLoading || !order) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Environment specific sandbox vs production URLs

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">Esewa Payment</h3>
      <p className="mb-4">
        You are being redirected to Esewa to complete your payment of Rs. {order.final_price}.
      </p>
      
      <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
      {/* Insert the payment form fields */}
        <div dangerouslySetInnerHTML={{ __html: paymentForm }} />
        
        <div className="flex gap-4 justify-center mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: You will be redirected to Esewa's secure payment page.</p>
        <p>Total Amount: Rs. {order.final_price}</p>
        <p>Order ID: {order.uuid}</p>
      </div>
    </div>
  );
};

export default EsewaPayment;