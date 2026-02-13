import { NextRequest, NextResponse } from "next/server";
import { versionStore } from "@/lib/version/versionStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const versionId = parseInt(id, 10);

  if (isNaN(versionId)) {
    return NextResponse.json({ error: "Invalid version ID" }, { status: 400 });
  }

  const version = versionStore.get(versionId);

  if (!version) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: version.id,
    timestamp: version.timestamp.toISOString(),
    userPrompt: version.userPrompt,
    code: version.code,
    explanation: version.explanation,
    componentsUsed: version.componentsUsed,
  });
}
