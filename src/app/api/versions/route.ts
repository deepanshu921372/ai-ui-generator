import { NextResponse } from "next/server";
import { versionStore } from "@/lib/version/versionStore";

export async function GET() {
  const versions = versionStore.getAll().map((v) => ({
    id: v.id,
    timestamp: v.timestamp.toISOString(),
    prompt: v.userPrompt.substring(0, 100) + (v.userPrompt.length > 100 ? "..." : ""),
    componentCount: v.componentsUsed.length,
  }));

  return NextResponse.json({ versions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const version = versionStore.add({
      userPrompt: body.userPrompt,
      code: body.code,
      explanation: body.explanation,
      componentsUsed: body.componentsUsed || [],
    });

    return NextResponse.json({
      version: {
        id: version.id,
        timestamp: version.timestamp.toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
