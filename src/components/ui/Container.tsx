import React from "react";

interface ContainerProps {
  maxWidth?: "sm" | "md" | "lg" | "full";
  padding?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

const maxWidthStyles = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  full: "max-w-full",
};

const paddingStyles = {
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
};

export function Container({
  maxWidth = "lg",
  padding = "md",
  children,
}: ContainerProps) {
  return (
    <div
      className={`
        mx-auto w-full
        ${maxWidthStyles[maxWidth]}
        ${paddingStyles[padding]}
      `}
    >
      {children}
    </div>
  );
}
