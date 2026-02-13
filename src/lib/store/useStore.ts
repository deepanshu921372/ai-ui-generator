import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  explanation?: string;
  isLoading?: boolean;
  step?: string;
}

export interface Version {
  id: number;
  timestamp: Date;
  userPrompt: string;
  code: string;
  explanation: string;
  componentsUsed: string[];
}

interface AppState {
  // Chat state
  messages: Message[];
  isGenerating: boolean;
  currentStep: string;

  // Code state
  code: string;

  // Version state
  versions: Version[];
  currentVersion: number | null;

  // Actions
  addMessage: (message: Omit<Message, "id" | "timestamp">) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setCode: (code: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCurrentStep: (step: string) => void;
  addVersion: (version: Omit<Version, "id" | "timestamp">) => void;
  setCurrentVersion: (versionId: number) => void;
  restoreVersion: (versionId: number) => void;
  clearMessages: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  messages: [],
  isGenerating: false,
  currentStep: "",
  code: "",
  versions: [],
  currentVersion: null,

  // Actions
  addMessage: (message) => {
    const id = crypto.randomUUID();
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id, timestamp: new Date() },
      ],
    }));
    return id;
  },

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }));
  },

  setCode: (code) => set({ code }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setCurrentStep: (currentStep) => set({ currentStep }),

  addVersion: (version) => {
    const id = get().versions.length + 1;
    const newVersion = { ...version, id, timestamp: new Date() };
    set((state) => ({
      versions: [...state.versions, newVersion],
      currentVersion: id,
    }));
  },

  setCurrentVersion: (versionId) => set({ currentVersion: versionId }),

  restoreVersion: (versionId) => {
    const version = get().versions.find((v) => v.id === versionId);
    if (version) {
      set({
        code: version.code,
        currentVersion: versionId,
      });
    }
  },

  clearMessages: () => set({ messages: [] }),
}));
