import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../api/orders';
import { useCart } from '../hooks/useCart';
import Loading from '../components/common/Loading';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { fetchCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        
        // Refresh cart after successful order
        fetchCart();
      } catch (err) {
        setError('Failed to load order details. Please check your email for confirmation.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, fetchCart]);
  
  if (loading) {
    return <Loading />;
  }
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        {error ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold mb-4">Order Status Pending</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <Link to="/profile" className="btn-primary">
                View Your Profile
              </Link>
              <Link to="/products" className="btn-secondary">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold mb-2">Thank You for Your Order!</h1>
              <p className="text-gray-600">Your order has been placed successfully.</p>
            </div>
            
            <div className="border rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Order Number:</span>
                <span>#{order.uuid}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Date:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Payment Status:</span>
                <span className="capitalize">{order.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span>${order.final_price }</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded">
                              {item.product.image && (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          ${item.price }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                        Subtotal:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        ${order.total_price }
                      </td>
                    </tr>
                    {order.discount > 0 && (
                      <tr>
                        <td colSpan="2" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          Discount:
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                          -${order.discount }
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                        Shipping:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {order.shipping_cost > 0 ? `$${order.shipping_cost }` : 'Free'}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                        ${order.final_price }
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <address className="text-sm text-gray-600 not-italic">
                  {order.shipping_address.name}<br />
                  {order.shipping_address.street}<br />
                  {order.shipping_address.city}, {order.shipping_address.postal_code}<br />
                  {order.shipping_address.phone}
                </address>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-sm text-gray-600 capitalize">
                  {order.payment_method}
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-6">
                A confirmation email has been sent to your email address.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/profile" className="btn-primary">
                  View Your Orders
                </Link>
                <Link to="/products" className="btn-secondary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessPage;