import { ArrowLeftRight } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface SwapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
}

export function SwapButton({
  className = "",
  size = "md",
  variant = "ghost",
  ...props
}: SwapButtonProps) {
  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const variantClasses = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "bg-transparent hover:bg-gray-100/50 text-gray-600",
  };

  return (
    <button
      type="button"
      className={`rounded-full transition-all duration-200 flex items-center justify-center ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <ArrowLeftRight className={`w-4 h-4`} />
    </button>
  );
}

export default SwapButton;
