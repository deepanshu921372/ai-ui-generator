import React from "react";

interface StackProps {
  direction?: "horizontal" | "vertical";
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  wrap?: boolean;
  children?: React.ReactNode;
}

const gapStyles = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const alignStyles = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export function Stack({
  direction = "vertical",
  gap = "md",
  align = "stretch",
  wrap = false,
  children,
}: StackProps) {
  return (
    <div
      className={`
        flex
        ${direction === "horizontal" ? "flex-row" : "flex-col"}
        ${gapStyles[gap]}
        ${alignStyles[align]}
        ${wrap ? "flex-wrap" : ""}
      `}
    >
      {children}
    </div>
  );
}
