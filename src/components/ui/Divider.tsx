import React from "react";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
}

const spacingStyles = {
  horizontal: {
    sm: "my-2",
    md: "my-4",
    lg: "my-6",
  },
  vertical: {
    sm: "mx-2",
    md: "mx-4",
    lg: "mx-6",
  },
};

export function Divider({
  orientation = "horizontal",
  spacing = "md",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={`
          w-px h-full bg-[#e2e8f0]
          ${spacingStyles.vertical[spacing]}
        `}
      />
    );
  }

  return (
    <hr
      className={`
        border-0 h-px bg-[#e2e8f0] w-full
        ${spacingStyles.horizontal[spacing]}
      `}
    />
  );
}
