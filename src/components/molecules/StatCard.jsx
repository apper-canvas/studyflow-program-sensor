import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient = "from-primary to-secondary",
  className 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all duration-200",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
            <ApperIcon name={icon} className="text-white" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;