import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({
  className,
  label,
  checked,
  ...props
}, ref) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          ref={ref}
          {...props}
        />
        <div className={cn(
          "w-6 h-6 border-2 rounded-lg transition-all duration-200 flex items-center justify-center",
          checked 
            ? "bg-gradient-to-r from-primary to-secondary border-primary text-white scale-110" 
            : "border-gray-300 bg-white group-hover:border-primary",
          className
        )}>
          {checked && (
            <ApperIcon name="Check" size={14} className="text-white" />
          )}
        </div>
      </div>
      {label && (
        <span className={cn(
          "text-sm font-medium transition-all duration-200",
          checked ? "text-gray-500 line-through" : "text-gray-700 group-hover:text-primary"
        )}>
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;