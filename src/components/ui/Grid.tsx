import React from "react";

interface GridProps {
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

const columnStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

const gapStyles = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

export function Grid({
  columns = 1,
  gap = "md",
  children,
}: GridProps) {
  return (
    <div
      className={`
        grid
        ${columnStyles[columns]}
        ${gapStyles[gap]}
      `}
    >
      {children}
    </div>
  );
}
