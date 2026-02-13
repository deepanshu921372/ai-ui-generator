"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { useStore } from "@/lib/store/useStore";

export function ChatInput() {
  const [input, setInput] = useState("");
  const {
    addMessage,
    updateMessage,
    setCode,
    setIsGenerating,
    setCurrentStep,
    addVersion,
    isGenerating,
    code,
    messages,
  } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    addMessage({ role: "user", content: userMessage });

    // Add placeholder for AI response and get the ID
    const aiMessageId = addMessage({
      role: "assistant",
      content: "Generating UI...",
      isLoading: true,
    });

    setIsGenerating(true);

    try {
      // Build conversation history (exclude the loading message)
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setCurrentStep("Planning...");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          currentCode: code || null,
          conversationHistory,
        }),
      });

      const data = await response.json();

      console.log("API Response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate UI");
      }

      // Update the code
      setCode(data.code);

      // Update AI message with explanation
      updateMessage(aiMessageId, {
        content: "UI generated successfully!",
        explanation: data.explanation,
        isLoading: false,
      });

      // Save version
      addVersion({
        userPrompt: userMessage,
        code: data.code,
        explanation: data.explanation,
        componentsUsed: data.componentsUsed || [],
      });

      // Save to server-side version store
      await fetch("/api/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: userMessage,
          code: data.code,
          explanation: data.explanation,
          componentsUsed: data.componentsUsed || [],
        }),
      });

    } catch (error) {
      console.error("Generation error:", error);
      updateMessage(aiMessageId, {
        content: `Error: ${(error as Error).message}`,
        isLoading: false,
      });
    } finally {
      setIsGenerating(false);
      setCurrentStep("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the UI you want..."
          disabled={isGenerating}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
        />
        <button
          type="submit"
          disabled={isGenerating || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
