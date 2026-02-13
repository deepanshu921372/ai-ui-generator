"use client";

import React from "react";
import { AppNavbar } from "./AppNavbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <main>{children}</main>
    </div>
  );
}
