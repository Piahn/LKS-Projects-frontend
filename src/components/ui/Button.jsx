import { forwardRef } from "react";

const Button = forwardRef(
  ({ className, children, variant = "primary", ...props }, ref) => {
    const baseStyle =
      "px-4 py-2 rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300";

    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
      danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    };

    const variantStyle = variants[variant] || variants.primary;

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variantStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
