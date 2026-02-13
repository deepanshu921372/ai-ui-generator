import { getComponentSchemaString } from "@/lib/schema/components";
import { componentWhitelist } from "@/lib/validator/whitelist";

export function getPlannerPrompt(
  userMessage: string,
  currentCode: string | null,
  conversationHistory: { role: string; content: string }[]
): string {
  const historyStr = conversationHistory
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  return `You are a UI planning agent. Given a user's description, produce a structured JSON plan specifying layout and components. You MUST only use components from the provided registry.

COMPONENT REGISTRY:
${getComponentSchemaString()}

RULES:
1. Choose the most appropriate layout structure (sidebar-main, full-width, grid, stacked).
2. Select components that match the user's intent. Do not invent components.
3. If this is an ITERATION (previous code provided), output only the modifications needed.
4. Output valid JSON only. No markdown, no explanation, no code fences.

AVAILABLE COMPONENTS: ${componentWhitelist.join(", ")}

---

CONTEXT:
User message: "${userMessage}"
Current code: ${currentCode ? `"${currentCode.substring(0, 2000)}..."` : "null (new generation)"}
Conversation history: ${historyStr || "None"}

OUTPUT FORMAT (JSON only):
{
  "intent": "brief summary of what user wants",
  "layout": "sidebar-main | full-width | grid | stacked",
  "isIteration": boolean,
  "components": [
    {
      "type": "ComponentName",
      "props": { ... },
      "slot": "sidebar | main | header | footer | modal",
      "children": [ ... nested components ... ]
    }
  ],
  "modifications": [
    {
      "action": "add | remove | modify",
      "target": "description of what to change",
      "details": { ... }
    }
  ]
}`;
}

export function getGeneratorPrompt(
  plan: string,
  currentCode: string | null
): string {
  return `You are an expert React UI code generator. Create beautiful, well-structured UIs.

AVAILABLE COMPONENTS: ${componentWhitelist.join(", ")}
LAYOUT PRIMITIVES: Stack, Grid, Container, Page

STRICT RULES:
1. ONLY use listed components - no others
2. NO inline styles (style={{}}) or className props
3. Use realistic placeholder content (real names, dollar amounts, percentages)
4. Always wrap content in <Page> and <Container>
5. Use proper visual hierarchy with headings and spacing

DESIGN BEST PRACTICES:
- Use Grid with columns={3} or columns={4} for card layouts
- Use Stack with gap="lg" for main sections, gap="md" for subsections
- Always give Cards a title prop for clear labeling
- Use Stat components for metrics (with trend="up" or trend="down")
- Add Navbar at the top for navigation-heavy pages
- Use Divider to separate sections
- Combine Text variant="h1/h2/h3" for headings with Text variant="body" for content

COMPONENT SCHEMAS:
${getComponentSchemaString()}

PLAN:
${plan}

${currentCode ? `PREVIOUS CODE (modify minimally, preserve structure):
${currentCode}` : ""}

EXAMPLE - Dashboard:
import { Page, Container, Stack, Grid, Card, Stat, Text, Navbar, Button } from "@/components/ui";

export default function GeneratedUI() {
  return (
    <Page>
      <Navbar brand="Dashboard" items={[
        { label: "Overview", href: "/", active: true },
        { label: "Analytics", href: "/analytics" },
        { label: "Settings", href: "/settings" }
      ]} />
      <Container maxWidth="lg" padding="md">
        <Stack gap="lg">
          <Text variant="h1" weight="bold">Dashboard Overview</Text>
          <Grid columns={4} gap="md">
            <Stat label="Total Revenue" value="$45,231" change="+20.1%" trend="up" />
            <Stat label="Active Users" value="2,345" change="+15.2%" trend="up" />
            <Stat label="Conversion Rate" value="3.2%" change="-2.4%" trend="down" />
            <Stat label="Avg. Order Value" value="$52.40" change="+8.1%" trend="up" />
          </Grid>
          <Card title="Recent Activity" subtitle="Your latest updates">
            <Text variant="body">Activity content here...</Text>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

OUTPUT: Valid React JSX code only. No markdown fences. Start with import statement.`;
}

export function getExplainerPrompt(
  plan: string,
  code: string,
  userMessage: string,
  previousCode: string | null
): string {
  return `You are a UI decision explainer. Given the plan, the generated code, and (optionally) the previous code, explain in plain English:
1. What components were chosen and why
2. How the layout was structured and why
3. If iterating: what specifically changed and what was preserved

Keep it concise (3-6 bullet points). Reference specific component names and props.

PLAN: ${plan}
GENERATED CODE: ${code.substring(0, 3000)}
PREVIOUS CODE: ${previousCode ? previousCode.substring(0, 1000) : "None (new generation)"}
USER REQUEST: "${userMessage}"

Output a markdown-formatted explanation with bullet points. No code, just explanation.`;
}

export function getRetryPrompt(errors: string[]): string {
  return `The previous code generation had the following errors:
${errors.map((e) => `- ${e}`).join("\n")}

Please fix these issues and regenerate the code. Remember:
- Only use whitelisted components: ${componentWhitelist.join(", ")}
- No inline styles or custom className
- Must have a default export
- Only import from '@/components/ui'`;
}
