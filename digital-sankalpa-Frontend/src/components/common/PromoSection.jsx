import { useState, useEffect, useRef } from 'react';
import api from '../../api';

const PromoSection = () => {
  const [promocodes, setPromocodes] = useState([]);
  const [copyMessage, setCopyMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const copyTimeout = useRef(null);
  const sliderInterval = useRef(null);

  // Fetch promocodes when component mounts
  useEffect(() => {
    fetchPromocodes();
    
    // Setup slider interval if there are promocodes
    if (promocodes.length > 1) {
      sliderInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % promocodes.length);
      }, 5000); // Change slide every 5 seconds
    }
    
    // Cleanup interval on unmount
    return () => {
      if (sliderInterval.current) {
        clearInterval(sliderInterval.current);
      }
      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
    };
  }, [promocodes.length]); // Re-run when promocodes length changes

  const fetchPromocodes = async () => {
    try {
      const response = await api.get('/api/discounts/promocodes/');
      // The backend already filters active promocodes
      setPromocodes(response.data);
    } catch (error) {
      console.error('Error fetching promocodes:', error);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopyMessage('Promo code copied to clipboard!');
    
    // Clear the message after 3 seconds
    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current);
    }
    copyTimeout.current = setTimeout(() => {
      setCopyMessage('');
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 py-8 px-4 my-8 rounded-xl shadow-md">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Available Promocodes
        </h2>

        {/* Copy Success Message */}
        {copyMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center transition-opacity duration-300">
            {copyMessage}
          </div>
        )}

        {/* Promocodes Slider */}
        <div className="relative overflow-hidden">
          {promocodes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <p className="text-gray-600">No active promocodes available at the moment.</p>
            </div>
          ) : (
            <div className="slider-container overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {promocodes.map((promo) => (
                  <div
                    key={promo.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-3xl mx-auto">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <div>
                          <h3 className="text-3xl font-bold font-mono tracking-wider">{promo.code}</h3>
                          <div className="mt-1 text-sm bg-blue-500 inline-block px-3 py-1 rounded-full">
                            {promo.is_percentage ? `${promo.discount_amount}% OFF` : `$${promo.discount_amount} OFF`}
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(promo.code)}
                          className="p-2 hover:bg-blue-500 rounded-full transition-colors flex items-center gap-2"
                          title="Copy code"
                        >
                          <span className="text-sm">Copy Code</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4 bg-gray-50">
                        <p className="text-gray-700 text-lg mb-4">Save {promo.is_percentage ? `${promo.discount_amount}%` : `$${promo.discount_amount}`} on your purchase</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Valid from {new Date(promo.valid_from).toLocaleDateString()} until {new Date(promo.valid_until).toLocaleDateString()}</span>
                          </div>
                          {promo.max_uses && (
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Maximum uses: {promo.max_uses}</span>
                            </div>
                          )}
                          {promo.min_purchase && (
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Minimum purchase: ${promo.min_purchase}</span>
                            </div>
                          )}
                          {promo.max_discount && (
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span>Maximum discount: ${promo.max_discount}</span>
                            </div>
                          )}
                          {promo.uses_remaining && (
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              <span>Uses remaining: {promo.uses_remaining}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows - Only show if multiple promocodes */}
              {promocodes.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev - 1 + promocodes.length) % promocodes.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 p-2 rounded-r-lg shadow-lg transition-colors duration-300 z-10"
                    aria-label="Previous slide"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev + 1) % promocodes.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 p-2 rounded-l-lg shadow-lg transition-colors duration-300 z-10"
                    aria-label="Next slide"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Slider Pagination Dots */}
          {promocodes.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {promocodes.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoSection;