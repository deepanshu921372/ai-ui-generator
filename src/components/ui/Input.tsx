import React from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  required?: boolean;
  helperText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  placeholder,
  type = "text",
  required = false,
  helperText,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#0f172a]">
          {label}
          {required && <span className="text-[#dc2626] ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="
          px-3 py-2 rounded-lg border border-[#e2e8f0]
          text-[#0f172a] placeholder-[#94a3b8]
          focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent
          transition-all duration-200
        "
      />
      {helperText && (
        <span className="text-xs text-[#475569]">{helperText}</span>
      )}
    </div>
  );
}
