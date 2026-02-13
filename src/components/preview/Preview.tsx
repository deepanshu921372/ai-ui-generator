"use client";

import React, { useState, useEffect } from "react";
import { Monitor, Smartphone, AlertCircle, RefreshCw } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { PreviewFrame } from "./PreviewFrame";

type ViewMode = "desktop" | "mobile";

export function Preview() {
  const { code, currentVersion, versions } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setError(null);
    setKey((k) => k + 1);
  }, [code]);

  const handleError = (err: string) => {
    setError(err);
  };

  const handleRefresh = () => {
    setError(null);
    setKey((k) => k + 1);
  };

  const currentVersionData = versions.find((v) => v.id === currentVersion);
  const componentsUsed = currentVersionData?.componentsUsed || [];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div>
          <h2 className="font-semibold text-gray-900">Preview</h2>
          <p className="text-sm text-gray-500">
            {currentVersion ? `Version ${currentVersion}` : "Live preview"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "desktop"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "mobile"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Preview Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div
          className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mx-auto transition-all min-h-[500px] ${
            viewMode === "mobile" ? "max-w-[375px]" : "w-full"
          }`}
        >
          {code ? (
            <PreviewFrame key={key} code={code} onError={handleError} />
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-4">🖼️</div>
                <p>Preview will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {componentsUsed.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500">
            Components used: {componentsUsed.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
