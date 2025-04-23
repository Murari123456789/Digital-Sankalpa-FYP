import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/common/ProductCard';
import Loading from '../components/common/Loading';
import PromoSection from '../components/common/PromoSection';

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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-2xl overflow-hidden mb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("/images/pattern.svg")', backgroundSize: '30px 30px' }} />
        </div>

        <div className="relative flex flex-col md:flex-row items-center container mx-auto px-4 py-12">
          {/* Left Content */}
          <div className="md:w-1/2 text-white z-10 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your One-Stop Shop for <span className="text-yellow-400">Digital Printing</span> Solutions
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Discover our wide range of printers, accessories, and supplies. Professional quality for your home and office needs.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/products"
                className="bg-white text-blue-600 hover:bg-yellow-400 hover:text-blue-800 transition-colors duration-300 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl"
              >
                Shop Now
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-colors duration-300 font-semibold py-3 px-8 rounded-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Images Grid */}
          <div className="md:w-1/2 grid grid-cols-2 gap-4 p-4">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/hero-printer-1.jpg"
                  alt="Professional Printer"
                  className="w-full h-48 object-cover"
                  onError={(e) => e.target.src = 'https://placehold.co/400x300/2563eb/ffffff?text=Professional+Printer'}
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/hero-ink.jpg"
                  alt="Premium Ink"
                  className="w-full h-32 object-cover"
                  onError={(e) => e.target.src = 'https://placehold.co/400x300/2563eb/ffffff?text=Premium+Ink'}
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/hero-accessories.jpg"
                  alt="Printer Accessories"
                  className="w-full h-32 object-cover"
                  onError={(e) => e.target.src = 'https://placehold.co/400x300/2563eb/ffffff?text=Printer+Accessories'}
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/images/hero-printer-2.jpg"
                  alt="Office Printer"
                  className="w-full h-48 object-cover"
                  onError={(e) => e.target.src = 'https://placehold.co/400x300/2563eb/ffffff?text=Office+Printer'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Code Section */}
      <PromoSection />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
