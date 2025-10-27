import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({
  className,
  variant = "primary",
  size = "default",
  icon,
  loading = false,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg",
    secondary: "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-gradient-to-r from-error to-red-500 text-white hover:shadow-lg",
    success: "bg-gradient-to-r from-success to-emerald-500 text-white hover:shadow-lg"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-2.5",
    lg: "px-8 py-3 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="animate-spin" size={16} />
      ) : icon && (
        <ApperIcon name={icon} size={16} />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;