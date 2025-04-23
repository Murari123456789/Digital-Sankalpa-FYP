import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePopup } from '../../contexts/PopupContext';
import { useToast } from '../../contexts/ToastContext';

const CATEGORIES = [
  { id: 'printer', label: 'Printers' },
  { id: 'ink', label: 'Ink & Toner' },
  { id: 'heatpress', label: 'Heat Press' }
];

const ProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showPopup } = usePopup();
  const { showToast } = useToast();
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
    showPopup({
      title: 'Apply Filters',
      message: 'Are you sure you want to apply these filters?',
      onConfirm: () => {
        applyFiltersToURL();
      }
    });
  };

  // Apply filters to URL
  const applyFiltersToURL = () => {
    const newParams = new URLSearchParams(searchParams);
    
    // Validate price range
    const min = parseFloat(priceRange.min);
    const max = parseFloat(priceRange.max);
    
    // Create filter summary for toast message
    let filterSummary = [];
    if (selectedCategories.length > 0) {
      const categoryLabels = selectedCategories.map(id => 
        CATEGORIES.find(cat => cat.id === id)?.label
      ).filter(Boolean);
      filterSummary.push(`Categories: ${categoryLabels.join(', ')}`);
    }
    if (min) filterSummary.push(`Min Price: Rs.${min}`);
    if (max) filterSummary.push(`Max Price: Rs.${max}`);
    if (sortBy) filterSummary.push(`Sort: ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`);

    
    if (!isNaN(min) && min >= 0) {
      newParams.set('min_price', min.toString());
    } else {
      newParams.delete('min_price');
    }
    
    if (!isNaN(max) && max >= 0) {
      if (min && max < min) {
        // If max is less than min, set it equal to min
        newParams.set('max_price', min.toString());
        setPriceRange(prev => ({ ...prev, max: min.toString() }));
      } else {
        newParams.set('max_price', max.toString());
      }
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
    
    // Keep existing search query if any
    const query = searchParams.get('query');
    if (query) {
      newParams.set('query', query);
    }
    
    // Reset to page 1 when filtering
    newParams.set('page', '1');
    
    setSearchParams(newParams);

    // Show success toast with filter summary
    const message = filterSummary.length > 0 
      ? `Filters applied: ${filterSummary.join(' | ')}` 
      : 'All filters have been cleared';
    showToast(message);
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
    showToast('All filters have been cleared');
  };
  
  // Handle price range input change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Only allow positive numbers and empty string
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setPriceRange(prev => ({
        ...prev,
        [name]: value,
      }));
    }
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
          Apply
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