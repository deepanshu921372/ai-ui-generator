import React from "react";

interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface NavbarProps {
  brand: string;
  items?: NavItem[];
  actions?: React.ReactNode;
}

export function Navbar({
  brand,
  items = [],
  actions,
}: NavbarProps) {
  return (
    <header className="bg-white border-b border-[#e2e8f0] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-[#0f172a]">{brand}</h1>
          {items.length > 0 && (
            <nav className="hidden md:flex items-center gap-1">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href || "#"}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${
                      item.active
                        ? "text-[#2563eb] bg-[#eff6ff]"
                        : "text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                    }
                  `}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
