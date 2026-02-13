"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  value: string;
  onClick?: () => void;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  variant?: "default" | "outline";
}

export function Dropdown({
  label,
  items,
  variant = "default",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonStyles =
    variant === "outline"
      ? "border-2 border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc]"
      : "bg-[#f8fafc] text-[#0f172a] hover:bg-[#e2e8f0]";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          font-medium text-sm transition-colors duration-150
          ${buttonStyles}
        `}
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-white rounded-lg border border-[#e2e8f0] shadow-lg py-1 z-50">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors duration-150"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
