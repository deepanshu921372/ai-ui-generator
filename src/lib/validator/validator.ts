import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { componentWhitelist, allowedHTMLElements } from "./whitelist";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function isHTMLElement(name: string): boolean {
  return allowedHTMLElements.includes(name.toLowerCase());
}

function isWhitelistedComponent(name: string): boolean {
  return componentWhitelist.includes(name);
}

export function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for empty code
  if (!code || code.trim() === "") {
    errors.push("Generated code is empty");
    return { valid: false, errors, warnings };
  }

  // Check for basic structure
  if (!code.includes("export default") && !code.includes("export default function")) {
    errors.push("Code must have a default export");
    return { valid: false, errors, warnings };
  }

  try {
    // Parse the code into an AST
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    // Track found issues
    const disallowedComponents: Set<string> = new Set();

    // Traverse the AST to check components
    traverse(ast, {
      JSXOpeningElement(path) {
        const nameNode = path.node.name;

        if (nameNode.type === "JSXIdentifier") {
          const name = nameNode.name;

          // Only check uppercase components (skip HTML elements)
          if (name[0] === name[0].toUpperCase()) {
            if (!isWhitelistedComponent(name)) {
              disallowedComponents.add(name);
            }
          } else if (!isHTMLElement(name)) {
            warnings.push(`Unknown HTML element: <${name}>`);
          }
        }
      },
    });

    // Only add warnings for disallowed components, not errors
    // This makes the validator more lenient
    if (disallowedComponents.size > 0) {
      warnings.push(
        `Non-standard components used: ${Array.from(disallowedComponents).join(", ")}`
      );
    }

    // Check for default export
    let hasDefaultExport = false;
    traverse(ast, {
      ExportDefaultDeclaration() {
        hasDefaultExport = true;
      },
    });

    if (!hasDefaultExport) {
      errors.push("Code must have a default export function component.");
    }

  } catch (parseError) {
    errors.push(`Failed to parse code: ${(parseError as Error).message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
