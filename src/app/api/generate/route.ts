import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/ai/pipeline";

export interface GenerateRequest {
  message: string;
  currentCode: string | null;
  conversationHistory: { role: string; content: string }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    const { message, currentCode, conversationHistory } = body;

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set GROQ_API_KEY environment variable. Get a free key at https://console.groq.com/keys" },
        { status: 500 }
      );
    }

    console.log("Starting pipeline with message:", message);
    console.log("API Key present:", !!apiKey);

    const result = await runPipeline(
      message,
      currentCode,
      conversationHistory || [],
      apiKey
    );

    console.log("Pipeline result:", {
      success: result.success,
      errors: result.errors,
      hasCode: !!result.code,
      codeLength: result.code?.length,
    });

    if (!result.success) {
      console.error("Pipeline failed with errors:", result.errors);
      return NextResponse.json(
        {
          error: result.errors.join("; "),
          code: result.code,
          plan: result.plan,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      code: result.code,
      plan: result.plan,
      explanation: result.explanation,
      componentsUsed: result.componentsUsed,
      warnings: result.warnings,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
