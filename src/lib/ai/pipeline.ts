import { runPlanner, type PlannerOutput } from "./planner";
import { runGenerator, type GeneratorOutput } from "./generator";
import { runExplainer } from "./explainer";

export interface PipelineResult {
  success: boolean;
  code: string;
  plan: PlannerOutput | null;
  explanation: string;
  componentsUsed: string[];
  errors: string[];
  warnings: string[];
}

export interface PipelineCallbacks {
  onStepChange?: (step: string) => void;
}

export async function runPipeline(
  userMessage: string,
  currentCode: string | null,
  conversationHistory: { role: string; content: string }[],
  apiKey: string,
  callbacks?: PipelineCallbacks
): Promise<PipelineResult> {
  const { onStepChange } = callbacks || {};

  try {
    // Step 1: Planning
    onStepChange?.("Planning...");
    const plan = await runPlanner(userMessage, currentCode, conversationHistory, apiKey);

    // Step 2: Generating
    onStepChange?.("Generating code...");
    const generatorResult: GeneratorOutput = await runGenerator(plan, currentCode, apiKey);

    if (!generatorResult.validationPassed || !generatorResult.code) {
      return {
        success: false,
        code: currentCode || "",
        plan,
        explanation: "",
        componentsUsed: [],
        errors: generatorResult.errors.length > 0
          ? generatorResult.errors
          : ["Failed to generate valid code after multiple attempts"],
        warnings: generatorResult.warnings,
      };
    }

    // Step 3: Validating
    onStepChange?.("Validating...");
    // Validation already done in generator

    // Step 4: Explaining
    onStepChange?.("Explaining...");
    const explanation = await runExplainer(
      plan,
      generatorResult.code,
      userMessage,
      currentCode,
      apiKey
    );

    onStepChange?.("Done");

    return {
      success: true,
      code: generatorResult.code,
      plan,
      explanation,
      componentsUsed: generatorResult.componentsUsed,
      errors: [],
      warnings: generatorResult.warnings,
    };
  } catch (error) {
    onStepChange?.("Error");
    return {
      success: false,
      code: currentCode || "",
      plan: null,
      explanation: "",
      componentsUsed: [],
      errors: [(error as Error).message],
      warnings: [],
    };
  }
}
