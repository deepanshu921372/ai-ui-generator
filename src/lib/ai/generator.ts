import Groq from "groq-sdk";
import { getGeneratorPrompt, getRetryPrompt } from "./prompts";
import { validateGeneratedCode } from "@/lib/validator/validator";
import type { PlannerOutput } from "./planner";

export interface GeneratorOutput {
  code: string;
  validationPassed: boolean;
  errors: string[];
  warnings: string[];
  componentsUsed: string[];
}

function extractComponentsUsed(code: string): string[] {
  const importMatch = code.match(/import\s*\{([^}]+)\}\s*from\s*["']@\/components\/ui["']/);
  if (importMatch) {
    return importMatch[1]
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
  }
  return [];
}

function cleanGeneratedCode(code: string): string {
  // Remove markdown code fences
  let cleaned = code
    .replace(/```(?:jsx|tsx|javascript|typescript|react)?\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  // Ensure the code starts with import
  const importIndex = cleaned.indexOf("import");
  if (importIndex > 0) {
    cleaned = cleaned.substring(importIndex);
  }

  return cleaned;
}

export async function runGenerator(
  plan: PlannerOutput,
  currentCode: string | null,
  apiKey: string
): Promise<GeneratorOutput> {
  const groq = new Groq({ apiKey });

  const planString = JSON.stringify(plan, null, 2);
  let prompt = getGeneratorPrompt(planString, currentCode);

  let retries = 0;
  const maxRetries = 2;
  let lastErrors: string[] = [];
  let lastCode = "";

  while (retries <= maxRetries) {
    try {
      console.log(`Generator attempt ${retries + 1}/${maxRetries + 1}`);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 8192,
      });

      const text = completion.choices[0]?.message?.content || "";

      console.log("Raw response length:", text.length);

      // Clean the generated code
      const code = cleanGeneratedCode(text);
      lastCode = code;

      console.log("Cleaned code length:", code.length);
      console.log("Code preview:", code.substring(0, 200));

      // Validate the code
      const validation = validateGeneratedCode(code);

      console.log("Validation result:", validation);

      if (validation.valid) {
        return {
          code,
          validationPassed: true,
          errors: [],
          warnings: validation.warnings,
          componentsUsed: extractComponentsUsed(code),
        };
      }

      // If validation failed, retry with error feedback
      lastErrors = validation.errors;
      retries++;

      if (retries <= maxRetries) {
        console.log("Retrying due to validation errors:", validation.errors);
        prompt = getGeneratorPrompt(planString, currentCode) + "\n\n" + getRetryPrompt(validation.errors);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error("Generator error:", error);
      retries++;
      lastErrors = [(error as Error).message];
      if (retries > maxRetries) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Return last attempt even if it has errors - but include the code for debugging
  return {
    code: lastCode,
    validationPassed: false,
    errors: lastErrors,
    warnings: [],
    componentsUsed: extractComponentsUsed(lastCode),
  };
}
