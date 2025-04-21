import { formatDistanceToNow } from 'date-fns';

const ProductReview = ({ review, currentUser }) => {
  const formattedDate = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });
  const isCurrentUserReview = currentUser && review.user_id === currentUser.id;
  
  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:mb-0 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
            <span className="text-white text-sm font-medium">
              {review.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="font-medium text-gray-900">
                {review.username}
                {isCurrentUserReview && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Your Review
                  </span>
                )}
              </h4>
            </div>
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400 mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>
      <div className="pl-13 ml-10">
        <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
      </div>
    </div>
  );
};

export default ProductReview;