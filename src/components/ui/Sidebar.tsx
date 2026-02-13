import React from "react";

interface NavItem {
  label: string;
  icon?: string;
  href?: string;
  active?: boolean;
}

interface SidebarProps {
  items: NavItem[];
  collapsed?: boolean;
  title?: string;
}

export function Sidebar({
  items,
  collapsed = false,
  title,
}: SidebarProps) {
  return (
    <aside
      className={`
        bg-[#f8fafc] border-r border-[#e2e8f0] h-full
        ${collapsed ? "w-16" : "w-64"}
        transition-all duration-300
      `}
    >
      {title && !collapsed && (
        <div className="p-4 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#0f172a]">{title}</h2>
        </div>
      )}
      <nav className="p-2">
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <a
                href={item.href || "#"}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg
                  text-sm font-medium transition-colors duration-150
                  ${
                    item.active
                      ? "bg-[#2563eb] text-white"
                      : "text-[#475569] hover:bg-[#e2e8f0]"
                  }
                `}
              >
                {item.icon && <span>{item.icon}</span>}
                {!collapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
