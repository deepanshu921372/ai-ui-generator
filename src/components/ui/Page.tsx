import React from "react";

interface PageProps {
  children?: React.ReactNode;
}

export function Page({ children }: PageProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {children}
    </div>
  );
}
