"use client";

import React from "react";
import { useStore } from "@/lib/store/useStore";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export function ChatPanel() {
  const { messages, isGenerating, currentStep } = useStore();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-[350px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Chat</h2>
        <p className="text-sm text-gray-500">Describe the UI you want to create</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Welcome!</h3>
            <p className="text-sm text-gray-500">
              Describe the UI you want to build and I&apos;ll generate it for you.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-400">Try something like:</p>
              <div className="text-xs text-blue-600 space-y-1">
                <p>&quot;Create a dashboard with stats cards&quot;</p>
                <p>&quot;Build a settings page with a form&quot;</p>
                <p>&quot;Make a sidebar navigation layout&quot;</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>{currentStep || "Processing..."}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput />
    </div>
  );
}
