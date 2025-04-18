import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  { id: 'printer', label: 'Printers' },
  { id: 'ink', label: 'Ink & Toner' },
  { id: 'heatpress', label: 'Heat Press' }
];

const ProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('min_price') || '',
    max: searchParams.get('max_price') || '',
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('categories')?.split(',').filter(Boolean) || []
  );
  
  // Handle category toggle
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  // Apply filters
  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    // Add price range filters if set
    if (priceRange.min) {
      newParams.set('min_price', priceRange.min);
    } else {
      newParams.delete('min_price');
    }
    
    if (priceRange.max) {
      newParams.set('max_price', priceRange.max);
    } else {
      newParams.delete('max_price');
    }
    
    // Add sort option
    if (sortBy) {
      newParams.set('sort', sortBy);
    } else {
      newParams.delete('sort');
    }

    // Add categories
    if (selectedCategories.length > 0) {
      newParams.set('categories', selectedCategories.join(','));
    } else {
      newParams.delete('categories');
    }
    
    // Reset to page 1 when filtering
    newParams.set('page', '1');
    
    setSearchParams(newParams);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setSelectedCategories([]);
    
    const newParams = new URLSearchParams();
    const query = searchParams.get('query');
    if (query) {
      newParams.set('query', query);
    }
    newParams.set('page', '1');
    
    setSearchParams(newParams);
  };
  
  // Handle price range input change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Products</h2>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="popular">Popularity</option>
        </select>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              name="min"
              placeholder="Min"
              value={priceRange.min}
              onChange={handlePriceChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <input
              type="number"
              name="max"
              placeholder="Max"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(category => (
            <div key={category.id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="flex-1 btn-primary"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 btn-secondary"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;