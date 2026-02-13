"use client";

import React, { useState, useRef, useEffect } from "react";
import { History, ChevronDown, RotateCcw } from "lucide-react";
import { useStore, type Version } from "@/lib/store/useStore";

interface VersionDropdownProps {
  versions: Version[];
  currentVersion: number | null;
}

export function VersionDropdown({ versions, currentVersion }: VersionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { restoreVersion } = useStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRestore = (versionId: number) => {
    restoreVersion(versionId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <History className="w-4 h-4" />
        <span>Version {currentVersion || "-"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Version History</h3>
            <p className="text-xs text-gray-500">{versions.length} version(s)</p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {versions
              .slice()
              .reverse()
              .map((version) => (
                <div
                  key={version.id}
                  className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                    version.id === currentVersion ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleRestore(version.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        version.id === currentVersion ? "text-blue-600" : "text-gray-900"
                      }`}>
                        v{version.id}
                      </span>
                      {version.id === currentVersion && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    {version.id !== currentVersion && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(version.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Restore this version"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {version.userPrompt}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {version.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
          </div>

          {versions.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              No versions yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
