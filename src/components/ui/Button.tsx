import React from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const variantStyles = {
  primary: "bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
  secondary: "bg-[#64748b] text-white hover:bg-[#475569]",
  outline: "border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white",
  danger: "bg-[#dc2626] text-white hover:bg-[#b91c1c]",
  ghost: "text-[#64748b] hover:bg-[#f1f5f9]",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-colors duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {children}
    </button>
  );
}
