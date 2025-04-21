import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../api/orders';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import { CheckCircle, AlertTriangle, ShoppingBag, Truck, CreditCard } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { fetchCart, clearCart } = useCart();
  const { refreshUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        console.log('Order data received:', orderData);
        setOrder(orderData);
        
        // Calculate points earned (1 point per Rs. 10 spent)
        const points = Math.floor(orderData.final_price / 10);
        setPointsEarned(points);
        
        // Refresh cart and user data after successful order
        if (orderData) {
          // Only refresh cart and user data once when order is loaded
          try {
            await Promise.all([fetchCart(), refreshUser()]);
            clearCart(); // Explicitly clear the cart on the frontend
          } catch (refreshErr) {
            console.error('Error refreshing data:', refreshErr);
          }
        }
      } catch (err) {
        setError('Failed to load order details. Please check your email for confirmation.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
    // Only re-run when orderId changes
  }, [orderId]);
  
  if (loading || !order) {
    return <Loading />;
  }
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="flex flex-col items-center justify-center p-8 text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" width="64" height="64" viewBox="0 0 256 256" xmlSpace="preserve">
              <g style={{stroke: "none", strokeWidth: 0, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "none", fillRule: "nonzero", opacity: 1}} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                <path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z" style={{stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(0,186,119)", fillRule: "nonzero", opacity: 1}} transform="matrix(1 0 0 1 0 0)" strokeLinecap="round"/>
                <polygon points="35.86,69.67 17.5,51.31 26.66,42.15 35.86,51.34 63.34,23.87 72.5,33.03" style={{stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(255,255,255)", fillRule: "nonzero", opacity: 1}} transform="matrix(1 0 0 1 0 0)"/>
              </g>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-lg opacity-90">Your order has been placed and is being processed.</p>
        </div>
      </div>
      
      {/* Order Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle size={32} className="text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Status Pending</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/profile" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md">
                View Your Profile
              </Link>
              <Link to="/products" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors shadow-md">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center p-8 border-b border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Thank You for Your Order!</h1>
              <p className="text-gray-600">Your order has been placed successfully.</p>
              {pointsEarned > 0 && (
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                  <span className="font-bold">+{pointsEarned}</span>&nbsp;
                  <span className="font-medium">reward points</span>&nbsp;will be added to your account!
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Order Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-bold mb-4 flex items-center">
                    <ShoppingBag className="mr-2" size={18} />
                    Order Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{order.uuid || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{order.created_at ? formatDate(order.created_at) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="capitalize font-medium">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {order.payment_status || 'Pending'}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-lg">Rs. {order.final_price || 0}</span>
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4 flex items-center">
                      <Truck className="mr-2" size={18} />
                      Shipping Address
                    </h2>
                    {order.shipping_address ? (
                      <address className="text-gray-600 not-italic leading-relaxed">
                        {order.shipping_address.name}<br />
                        {order.shipping_address.street}<br />
                        {order.shipping_address.city}, {order.shipping_address.postal_code}<br />
                        {order.shipping_address.phone}
                      </address>
                    ) : (
                      <p className="text-gray-600">Shipping information not available</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4 flex items-center">
                      <CreditCard className="mr-2" size={18} />
                      Payment Method
                    </h2>
                    <p className="text-gray-600 capitalize">
                      {order.payment_method || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <ShoppingBag className="mr-2" size={18} />
                  Order Items
                </h2>
                <div className="overflow-hidden border border-gray-200 rounded-lg shadow-md bg-white">
                
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.cart_items && order.cart_items.length > 0 ? order.cart_items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50 transition-colors duration-150'}>                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.product_name || 'Product'}
                                    className="h-16 w-16 object-contain p-1"
                                  />
                                ) : (
                                  <div className="h-16 w-16 bg-gray-100 flex items-center justify-center">
                                    <ShoppingBag size={24} className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  {item.product_name || 'Product'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Item #{item.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                            Rs. {item.price}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                            No items in this order
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200 bg-gray-50">
                        <td colSpan="2" className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                          Subtotal:
                        </td>
                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                          Rs. {order.total_price || 0}
                        </td>
                      </tr>
                      {order.discount > 0 && (
                        <tr className="bg-gray-50">
                          <td colSpan="2" className="px-6 py-2 text-right text-sm font-medium text-gray-700">
                            User Discount ({order.discount}%):
                          </td>
                          <td className="px-6 py-2 text-right text-sm font-medium text-green-600">
                            - Rs. {((order.total_price || 0) * (order.discount || 0) / 100).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      
                      {order.used_discount && (
                        <tr className="bg-gray-50">
                          <td colSpan="2" className="px-6 py-2 text-right text-sm font-medium text-gray-700">
                            <div className="flex items-center justify-end">
                              <span className="inline-flex items-center mr-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                {order.used_discount.reason || 'PROMO'}
                              </span>
                              <span>Promo Discount ({order.used_discount.discount_percentage}%):</span>
                            </div>
                          </td>
                          <td className="px-6 py-2 text-right text-sm font-medium text-green-600">
                            - Rs. {((order.total_price || 0) * (order.used_discount.discount_percentage || 0) / 100).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {order.points_redeemed > 0 && (
                        <tr className="bg-gray-50">
                          <td colSpan="2" className="px-6 py-2 text-right text-sm font-medium text-gray-700">
                            <div className="flex items-center justify-end">
                              <span className="inline-flex items-center mr-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {order.points_redeemed} points
                              </span>
                              <span>Points Redeemed:</span>
                            </div>
                          </td>
                          <td className="px-6 py-2 text-right text-sm font-medium text-green-600">
                            - Rs. {order.point_discount || 0}
                          </td>
                        </tr>
                      )}
                      <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 border-t-2 border-indigo-100">
                        <td colSpan="2" className="px-6 py-4 text-right text-base font-bold text-gray-900">
                          Total:
                        </td>
                        <td className="px-6 py-4 text-right text-base font-bold text-indigo-700">
                          Rs. {order.final_price || 0}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-10 border-t border-gray-200 pt-8 text-center">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/profile?tab=orders" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md">
                    View Your Orders
                  </Link>
                  <Link to="/products" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors shadow-md">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessPage;