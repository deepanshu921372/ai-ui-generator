import React from "react";

interface TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "label";
  weight?: "normal" | "medium" | "bold";
  children: React.ReactNode;
}

const variantStyles = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  body: "text-base",
  caption: "text-sm text-[#475569]",
  label: "text-sm text-[#64748b] uppercase tracking-wider",
};

const weightStyles = {
  normal: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
};

export function Text({
  variant = "body",
  weight = "normal",
  children,
}: TextProps) {
  const Component = variant.startsWith("h")
    ? (variant as "h1" | "h2" | "h3")
    : "p";

  return (
    <Component
      className={`
        text-[#0f172a]
        ${variantStyles[variant]}
        ${weightStyles[weight]}
      `}
    >
      {children}
    </Component>
  );
}
