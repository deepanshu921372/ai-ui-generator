import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  title,
  subtitle,
  children,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg border border-[#e2e8f0] shadow-sm
        ${paddingStyles[padding]}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-[#0f172a]">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-[#475569] mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
