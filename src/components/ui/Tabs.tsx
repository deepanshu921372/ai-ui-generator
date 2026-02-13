"use client";

import React, { useState } from "react";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
}

export function Tabs({ items, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  const activeContent = items.find((item) => item.id === activeTab)?.content;

  return (
    <div className="w-full">
      <div className="flex border-b border-[#e2e8f0]">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              px-4 py-2 text-sm font-medium
              border-b-2 transition-colors duration-150
              ${
                activeTab === item.id
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-[#64748b] hover:text-[#0f172a]"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="py-4">{activeContent}</div>
    </div>
  );
}
