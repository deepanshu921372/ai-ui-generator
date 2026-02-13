import Groq from "groq-sdk";
import { getPlannerPrompt } from "./prompts";

export interface PlannerOutput {
  intent: string;
  layout: "sidebar-main" | "full-width" | "grid" | "stacked";
  isIteration: boolean;
  components: ComponentPlan[];
  modifications?: Modification[];
}

export interface ComponentPlan {
  type: string;
  props: Record<string, unknown>;
  slot?: "sidebar" | "main" | "header" | "footer" | "modal";
  children?: ComponentPlan[];
}

export interface Modification {
  action: "add" | "remove" | "modify";
  target: string;
  details: Record<string, unknown>;
}

export async function runPlanner(
  userMessage: string,
  currentCode: string | null,
  conversationHistory: { role: string; content: string }[],
  apiKey: string
): Promise<PlannerOutput> {
  console.log("Starting planner with message:", userMessage);

  const groq = new Groq({ apiKey });

  const prompt = getPlannerPrompt(userMessage, currentCode, conversationHistory);

  let retries = 0;
  const maxRetries = 2;

  while (retries <= maxRetries) {
    try {
      console.log(`Planner attempt ${retries + 1}/${maxRetries + 1}`);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4096,
      });

      const text = completion.choices[0]?.message?.content || "";

      console.log("Planner raw response:", text.substring(0, 500));

      // Clean the response - remove markdown code fences if present
      let cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Parse JSON
      const plan = JSON.parse(cleanedText) as PlannerOutput;

      // Validate required fields
      if (!plan.intent || !plan.layout || !plan.components) {
        throw new Error("Missing required fields in plan");
      }

      console.log("Planner success:", plan.intent);
      return plan;
    } catch (error) {
      console.error("Planner error:", error);
      retries++;
      if (retries > maxRetries) {
        throw new Error(
          `Planner failed after ${maxRetries} retries: ${(error as Error).message}`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error("Planner failed unexpectedly");
}
