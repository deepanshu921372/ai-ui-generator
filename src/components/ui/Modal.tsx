import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({
  title,
  isOpen,
  onClose,
  children,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={`
          relative bg-white rounded-xl shadow-xl
          w-full ${sizeStyles[size]} mx-4
          animate-in fade-in zoom-in-95 duration-200
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#0f172a]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-5 h-5 text-[#64748b]" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
