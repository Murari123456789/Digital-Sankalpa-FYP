import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductList from '../components/products/ProductList';
import ProductFilter from '../components/products/ProductFilter.jsx';
import Pagination from '../components/common/Pagination';
import Loading from '../components/common/Loading';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  
  // Get all filter parameters from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const query = searchParams.get('query') || '';
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const sort = searchParams.get('sort');
  const categories = searchParams.get('categories');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Build params object with all filters
        const params = {
          page: currentPage,
          query,
          ...(minPrice && { min_price: minPrice }),
          ...(maxPrice && { max_price: maxPrice }),
          ...(sort && { sort }),
          ...(categories && { categories })
        };
        
        const response = await getProducts(params);
        setProducts(response.products);
        setTotalPages(response.total_pages);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, query, minPrice, maxPrice, sort, categories]);
  
  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber.toString());
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('query', searchQuery.trim());
    } else {
      newParams.delete('query');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };
  
  if (loading) return <Loading />;
  
  if (error) return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6 max-w-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-md"
      >
        Try Again
      </button>
    </div>
  );

  const activeFilters = !!query || !!minPrice || !!maxPrice || !!categories;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-lg mb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        <div className="relative py-12 px-8 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Products</h1>
          <p className="text-blue-100 mb-6 max-w-xl">
            Discover our wide range of high-quality products tailored to meet your needs
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl">
            <form onSubmit={handleSearchSubmit} className="flex w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-3 border-0 rounded-l-md shadow-inner focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-r-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-200 shadow-md"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="ml-2 hidden md:inline">Search</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Results information */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {query ? `Results for "${query}"` : "All Products"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Showing {products.length} products {currentPage > 1 ? `(Page ${currentPage})` : ''}
          </p>
        </div>
        
        {activeFilters && (
          <button 
            onClick={() => setSearchParams({})}
            className="mt-3 sm:mt-0 flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all filters
          </button>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
            <ProductFilter />
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:w-3/4">
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching your criteria.
              </p>
              {query && (
                <button 
                  onClick={() => setSearchParams({})}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  View all products
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <ProductList products={products} />
              
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;