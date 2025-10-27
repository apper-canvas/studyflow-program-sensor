import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  className,
  label,
  error,
  required = false,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "transition-colors duration-200",
          error && "border-error focus:ring-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;