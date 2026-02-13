import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const typeStyles = {
  info: {
    container: "bg-[#dbeafe] border-[#2563eb]",
    icon: "text-[#2563eb]",
    title: "text-[#1e40af]",
    message: "text-[#1e40af]",
  },
  success: {
    container: "bg-[#dcfce7] border-[#16a34a]",
    icon: "text-[#16a34a]",
    title: "text-[#166534]",
    message: "text-[#166534]",
  },
  warning: {
    container: "bg-[#fef3c7] border-[#d97706]",
    icon: "text-[#d97706]",
    title: "text-[#92400e]",
    message: "text-[#92400e]",
  },
  error: {
    container: "bg-[#fee2e2] border-[#dc2626]",
    icon: "text-[#dc2626]",
    title: "text-[#991b1b]",
    message: "text-[#991b1b]",
  },
};

const icons = {
  info: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

export function Alert({
  type = "info",
  title,
  message,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  const styles = typeStyles[type];
  const Icon = icons[type];

  return (
    <div
      className={`
        flex gap-3 p-4 rounded-lg border-l-4
        ${styles.container}
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${styles.icon}`} />
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold mb-1 ${styles.title}`}>{title}</h4>
        )}
        <p className={`text-sm ${styles.message}`}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 ${styles.icon} hover:opacity-70`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
