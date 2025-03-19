import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/common/ProductCard';
import Loading from '../components/common/Loading';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products and new arrivals
        const [featuredResponse, newArrivalsResponse] = await Promise.all([
          getProducts('', 1, { featured: true }),
          getProducts('', 1, { sort: 'newest' }),
        ]);
        
        setFeaturedProducts(featuredResponse.products.slice(0, 4));
        setNewArrivals(newArrivalsResponse.products.slice(0, 8));
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Quality Printers for Home and Office
            </h1>
            <p className="text-gray-600 mb-6">
              Find the perfect printing solution for your needs. From inkjet to laser, we've got you covered.
            </p>
            <div>
              <Link
                to="/products"
                className="btn-primary inline-block"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 bg-blue-100 flex items-center justify-center p-8">
            <div className="h-64 w-full bg-white rounded flex items-center justify-center">
              <h2 className="text-gray-500 text-">Digital Sankalpa</h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link to="/products?category=printers" className="group block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
          <div className="h-40 bg-blue-50 flex items-center justify-center">
            <span className="text-gray-500">Printers Image</span>
          </div>
          <div className="p-4 text-center">
            <h2 className="text-xl font-semibold group-hover:text-blue-600">Printers</h2>
            <p className="text-gray-600 mt-1">Inkjet, Laser & Photo Printers</p>
          </div>
        </Link>
        
        <Link to="/products?category=accessories" className="group block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
          <div className="h-40 bg-green-50 flex items-center justify-center">
            <span className="text-gray-500">Accessories Image</span>
          </div>
          <div className="p-4 text-center">
            <h2 className="text-xl font-semibold group-hover:text-blue-600">Accessories</h2>
            <p className="text-gray-600 mt-1">Cables, Stands & More</p>
          </div>
        </Link>
        
        <Link to="/products?category=ink" className="group block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
          <div className="h-40 bg-purple-50 flex items-center justify-center">
            <span className="text-gray-500">Ink & Toner Image</span>
          </div>
          <div className="p-4 text-center">
            <h2 className="text-xl font-semibold group-hover:text-blue-600">Ink & Toner</h2>
            <p className="text-gray-600 mt-1">Original & Compatible Cartridges</p>
          </div>
        </Link>
      </div>
      
      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            to="/products?featured=true"
            className="text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-600">No featured products available.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Promo Banner */}
      <div className="bg-blue-600 text-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Summer Sale! Up to 30% Off</h2>
          <p className="mb-6">Limited time offer on selected printers and accessories.</p>
          <Link
            to="/products?on_sale=true"
            className="inline-block bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100"
          >
            Shop the Sale
          </Link>
        </div>
      </div>
      
      {/* New Arrivals */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Link
            to="/products?sort=newest"
            className="text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-600">No new arrivals available.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Digital Sankalpa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Next-day delivery available on most items.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Genuine Products</h3>
              <p className="text-gray-600 text-sm">Authorized dealer for all major brands.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day hassle-free return policy.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">We're always here to help you.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">Stay up to date with our latest products and offers.</p>
          
          <form className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-r font-medium hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;