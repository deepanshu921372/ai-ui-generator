import Groq from "groq-sdk";
import { getExplainerPrompt } from "./prompts";
import type { PlannerOutput } from "./planner";

export async function runExplainer(
  plan: PlannerOutput,
  code: string,
  userMessage: string,
  previousCode: string | null,
  apiKey: string
): Promise<string> {
  const groq = new Groq({ apiKey });

  const planString = JSON.stringify(plan, null, 2);
  const prompt = getExplainerPrompt(planString, code, userMessage, previousCode);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "Unable to generate explanation.";
  } catch (error) {
    console.error("Explainer error:", error);
    return "Unable to generate explanation for this change.";
  }
}
