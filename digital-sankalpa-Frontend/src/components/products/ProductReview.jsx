import { formatDistance } from 'date-fns';

const ProductReview = ({ review }) => {
  // Format date as relative time (e.g., "2 days ago")
  const formattedDate = formatDistance(
    new Date(review.created_at),
    new Date(),
    { addSuffix: true }
  );
  
  return (
    <div className="border-b pb-6">
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-gray-500 text-sm font-medium">
              {review.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium">{review.username}</h4>
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    review.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};

export default ProductReview;