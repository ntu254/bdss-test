import React from 'react';
import { cn } from '../../utils/cn';

const badgeVariants = {
  default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  success: "bg-green-100 text-green-800 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  error: "bg-red-100 text-red-800 hover:bg-red-200",
  info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  primary: "bg-red-100 text-red-800 hover:bg-red-200",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
};

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  children, 
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        badgeVariants[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
Badge.displayName = "Badge";

export { Badge };