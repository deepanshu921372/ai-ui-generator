/**
 * Sanitizes user input to prevent prompt injection attacks
 */
export function sanitizeUserInput(input: string): string {
  // Remove potential role markers that could confuse the LLM
  const roleMarkers = [
    /SYSTEM:/gi,
    /ASSISTANT:/gi,
    /USER:/gi,
    /HUMAN:/gi,
    /AI:/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
  ];

  let sanitized = input;

  for (const marker of roleMarkers) {
    sanitized = sanitized.replace(marker, "");
  }

  // Trim and limit length
  sanitized = sanitized.trim().slice(0, 5000);

  return sanitized;
}

/**
 * Sanitizes AI output to extract only the code
 */
export function sanitizeCodeOutput(output: string): string {
  // Remove markdown code fences
  let sanitized = output
    .replace(/```(?:jsx|tsx|javascript|typescript|react)?\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();

  // Remove any explanatory text before the import statement
  const importIndex = sanitized.indexOf("import");
  if (importIndex > 0) {
    sanitized = sanitized.substring(importIndex);
  }

  // Remove any text after the closing of the component
  const lastBrace = sanitized.lastIndexOf("}");
  if (lastBrace !== -1) {
    // Check if there's trailing content
    const afterBrace = sanitized.substring(lastBrace + 1).trim();
    if (afterBrace.length > 0 && !afterBrace.startsWith("export")) {
      sanitized = sanitized.substring(0, lastBrace + 1);
    }
  }

  return sanitized;
}

/**
 * Validates that a string looks like valid React/JSX code
 */
export function looksLikeValidCode(code: string): boolean {
  // Must have an import statement
  if (!code.includes("import")) return false;

  // Must have a function or const declaration
  if (!code.includes("function") && !code.includes("const")) return false;

  // Must have return statement
  if (!code.includes("return")) return false;

  // Must have JSX (opening angle bracket followed by uppercase letter)
  if (!/return\s*\(\s*<[A-Z]/.test(code) && !/return\s*<[A-Z]/.test(code)) {
    return false;
  }

  return true;
}
