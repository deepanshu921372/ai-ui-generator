import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

const trendStyles = {
  up: {
    color: "text-[#16a34a]",
    bg: "bg-[#dcfce7]",
    Icon: TrendingUp,
  },
  down: {
    color: "text-[#dc2626]",
    bg: "bg-[#fee2e2]",
    Icon: TrendingDown,
  },
  neutral: {
    color: "text-[#64748b]",
    bg: "bg-[#f1f5f9]",
    Icon: Minus,
  },
};

export function Stat({
  label,
  value,
  change,
  trend = "neutral",
}: StatProps) {
  const trendStyle = trendStyles[trend];
  const TrendIcon = trendStyle.Icon;

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] p-4">
      <p className="text-sm text-[#64748b] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
      {change && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className={`
              flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium
              ${trendStyle.bg} ${trendStyle.color}
            `}
          >
            <TrendIcon className="w-3 h-3" />
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
