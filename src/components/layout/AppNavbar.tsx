"use client";

import React from "react";
import { Sparkles, Github } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { VersionDropdown } from "../version/VersionDropdown";

export function AppNavbar() {
  const { currentVersion, versions } = useStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">AI UI Generator</h1>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Powered by Groq
          </span>
        </div>

        <div className="flex items-center gap-4">
          {versions.length > 0 && (
            <VersionDropdown
              versions={versions}
              currentVersion={currentVersion}
            />
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
