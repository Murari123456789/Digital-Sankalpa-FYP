const PaymentMethod = ({ selectedMethod, onChange, onSubmit, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold">Payment Method</h2>
      </div>
      
      <form onSubmit={onSubmit} className="p-6">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === 'esewa' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              onClick={() => onChange('esewa')}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="esewa"
                  name="paymentMethod"
                  value="esewa"
                  checked={selectedMethod === 'esewa'}
                  onChange={() => onChange('esewa')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="esewa" className="ml-2 font-medium text-gray-700">
                  Esewa
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Pay using Esewa digital wallet
              </p>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === 'cod' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              onClick={() => onChange('cod')}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={selectedMethod === 'cod'}
                  onChange={() => onChange('cod')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="cod" className="ml-2 font-medium text-gray-700">
                  Cash on Delivery
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Pay when you receive the products
              </p>
            </div>
          </div>
        </div>
        
        {selectedMethod === 'esewa' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm">
              You will be redirected to the Esewa payment gateway after placing your order.
            </p>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary"
          >
            Back to Shipping
          </button>
          
          <button
            type="submit"
            className="btn-primary"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethod;