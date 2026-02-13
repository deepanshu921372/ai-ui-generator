"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Preview } from "@/components/preview/Preview";

export default function Home() {
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-57px)]">
        <ChatPanel />
        <CodeEditor />
        <Preview />
      </div>
    </AppLayout>
  );
}
