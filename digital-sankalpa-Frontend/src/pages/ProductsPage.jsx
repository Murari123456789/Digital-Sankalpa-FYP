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
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const query = searchParams.get('query') || '';
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts(query, currentPage);
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
  }, [query, currentPage]);
  
  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber.toString());
    setSearchParams(newParams);
  };
  
  if (loading) return <Loading />;
  
  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-500 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Try Again
      </button>
    </div>
  );
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Our Products</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <ProductFilter />
        </div>
        
        <div className="md:w-3/4">
          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No products found.</p>
              {query && (
                <p className="mt-2">
                  Try a different search term or{' '}
                  <button 
                    onClick={() => setSearchParams({})}
                    className="text-blue-500 hover:underline"
                  >
                    view all products
                  </button>
                </p>
              )}
            </div>
          ) : (
            <>
              <ProductList products={products} />
              
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;