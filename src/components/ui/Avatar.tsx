import React from "react";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string;
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-[#2563eb]",
    "bg-[#16a34a]",
    "bg-[#d97706]",
    "bg-[#dc2626]",
    "bg-[#8b5cf6]",
    "bg-[#06b6d4]",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function Avatar({ name, size = "md", src }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          ${sizeStyles[size]}
          rounded-full object-cover
        `}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]}
        ${getColorFromName(name)}
        rounded-full flex items-center justify-center
        text-white font-medium
      `}
    >
      {getInitials(name)}
    </div>
  );
}
