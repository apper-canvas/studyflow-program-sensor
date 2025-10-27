import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  className 
}) => {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-2xl p-8 max-w-md mx-auto">
        <div className="bg-gradient-to-r from-error to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" className="text-white" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-102 transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" className="inline mr-2" size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;