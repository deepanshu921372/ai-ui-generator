"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { Copy, Check } from "lucide-react";
import { useStore } from "@/lib/store/useStore";

export function CodeEditor() {
  const { code, setCode } = useStore();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="font-semibold text-gray-900">Code</h2>
          <p className="text-sm text-gray-500">Edit the generated code</p>
        </div>
        <button
          onClick={handleCopy}
          disabled={!code}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1">
        {code ? (
          <Editor
            height="100%"
            defaultLanguage="typescript"
            language="typescriptreact"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 16 },
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <p>Generated code will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
