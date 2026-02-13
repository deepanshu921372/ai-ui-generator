import React from "react";

interface BadgeProps {
  text: string;
  variant?: "info" | "success" | "warning" | "error";
}

const variantStyles = {
  info: "bg-[#dbeafe] text-[#1e40af]",
  success: "bg-[#dcfce7] text-[#166534]",
  warning: "bg-[#fef3c7] text-[#92400e]",
  error: "bg-[#fee2e2] text-[#991b1b]",
};

export function Badge({ text, variant = "info" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-medium
        ${variantStyles[variant]}
      `}
    >
      {text}
    </span>
  );
}
