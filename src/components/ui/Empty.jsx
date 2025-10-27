import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet",
  message = "Get started by adding your first item",
  actionText = "Add Item",
  onAction,
  icon = "Plus",
  className 
}) => {
  return (
    <div className={cn("text-center py-16 px-6", className)}>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 max-w-lg mx-auto">
        <div className="bg-gradient-to-r from-primary to-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} className="text-white" size={40} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-102 transition-all duration-200"
          >
            <ApperIcon name={icon} className="inline mr-2" size={18} />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;