# AI UI Generator

An AI-powered web application that converts natural language UI descriptions into working, live-rendered UIs using a deterministic component library.

**Built for Ryze AI Full-Stack Assignment**

## Live Demo

[Deployed URL - Add after deployment]

## Features

- **Natural Language to UI**: Describe what you want and get working React components
- **Deterministic Output**: Uses a fixed component library for consistent, predictable results
- **Multi-Step AI Agent**: Planner → Generator → Validator → Explainer pipeline
- **Live Preview**: See your UI render in real-time in a sandboxed iframe
- **Code Editor**: Edit generated code with Monaco Editor
- **Version History**: Roll back to any previous version
- **Iterative Editing**: Make incremental changes without full rewrites
- **Explainability**: AI explains why it made each decision

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
├─────────────┬─────────────────────┬─────────────────────────┤
│  Chat Panel │    Code Editor      │      Live Preview       │
│  (Intent)   │    (Monaco)         │      (Sandboxed)        │
└─────────────┴─────────────────────┴─────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI Agent Pipeline                         │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│  1. Planner │ 2. Generator│ 3. Validator│   4. Explainer    │
│  (Intent→   │ (Plan→Code) │ (AST Check) │   (Decisions→     │
│   Plan)     │             │             │    English)       │
└─────────────┴─────────────┴─────────────┴───────────────────┘
```

### AI Agent Pipeline (Multi-Step)

1. **Planner** (`src/lib/ai/planner.ts`)
   - Interprets user intent from natural language
   - Chooses layout structure (sidebar-main, full-width, grid, stacked)
   - Selects components from whitelist
   - Outputs structured JSON plan

2. **Generator** (`src/lib/ai/generator.ts`)
   - Converts plan into valid React/JSX code
   - Uses only whitelisted components
   - Handles iteration (modifies existing code, not full rewrites)
   - Retries on validation failure

3. **Validator** (`src/lib/validator/validator.ts`)
   - AST-based validation using @babel/parser
   - Enforces component whitelist
   - Ensures valid React structure
   - Returns errors/warnings

4. **Explainer** (`src/lib/ai/explainer.ts`)
   - Generates human-readable explanation
   - References layout and component choices
   - Explains what changed during iteration

### Component System Design

**16 UI Components** (Deterministic, immutable implementations):
- Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
- Badge, Avatar, Tabs, Alert, Dropdown, Divider, Text, Stat

**4 Layout Primitives**:
- Stack (flex column/row)
- Grid (responsive grid)
- Container (centered, max-width)
- Page (full page wrapper)

**Constraints Enforced**:
- No inline styles in generated code
- No AI-generated CSS
- No arbitrary Tailwind classes
- No external UI libraries
- Components render identically every time

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **AI Provider**: Groq API (Llama 3.3 70B) - Free, fast inference
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **Styling**: Tailwind CSS (app only, not in generated code)
- **Validation**: @babel/parser + @babel/traverse (AST analysis)
- **Preview**: Sandboxed iframe with Babel standalone

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Groq API key (free at https://console.groq.com/keys)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd "UI Generator"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Groq API key to `.env.local`:
```
GROQ_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Type a description in the chat panel (e.g., "Create a dashboard with stats cards")
2. Wait for the AI to generate the UI (Planning → Generating → Validating → Done)
3. View the live preview on the right
4. Read the AI's explanation of its decisions
5. Edit the code in the middle panel if needed
6. Make iterative changes by sending follow-up messages
7. Use the version dropdown to restore previous versions

## Example Prompts

- "Create a dashboard with stats cards showing revenue and users"
- "Build a settings page with a form and a modal"
- "Make a portfolio website with a navbar and project cards"
- "Add a sidebar with navigation links"
- "Make it more minimal and change the color scheme"

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # Main generation endpoint
│   │   └── versions/            # Version management
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                      # Component library (16 + 4 layouts)
│   ├── chat/                    # Chat panel components
│   ├── editor/                  # Monaco editor wrapper
│   ├── preview/                 # Live preview with sandboxed iframe
│   ├── version/                 # Version history dropdown
│   └── layout/                  # App layout components
└── lib/
    ├── ai/
    │   ├── planner.ts           # Step 1: Intent → Plan
    │   ├── generator.ts         # Step 2: Plan → Code
    │   ├── explainer.ts         # Step 4: Explain decisions
    │   ├── pipeline.ts          # Orchestrates all steps
    │   └── prompts.ts           # All prompt templates
    ├── validator/
    │   ├── validator.ts         # AST-based validation
    │   └── whitelist.ts         # Component whitelist
    ├── schema/
    │   └── components.ts        # Component prop schemas
    ├── store/
    │   └── useStore.ts          # Zustand state management
    └── version/
        └── versionStore.ts      # Server-side version storage
```

## API Endpoints

### POST /api/generate
Generate UI from natural language description.

**Request:**
```json
{
  "message": "Create a dashboard with stats cards",
  "currentCode": null,
  "conversationHistory": []
}
```

**Response:**
```json
{
  "code": "import { Card, Stat, Grid, Page } from '@/components/ui'...",
  "plan": { "intent": "...", "layout": "full-width", "components": [...] },
  "explanation": "The dashboard was created with...",
  "componentsUsed": ["Card", "Stat", "Grid", "Page"],
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### GET /api/versions
List all saved versions.

### GET /api/versions/:id
Get a specific version by ID.

## Known Limitations

1. **No persistence**: Versions are stored in-memory and lost on server restart
2. **Single user**: No multi-user support or session management
3. **Limited component set**: 20 components covers common cases but not all UIs
4. **Mock chart data**: Charts use simplified CSS-based rendering
5. **Token limits**: Very complex UIs may exceed LLM context window
6. **Preview sandbox**: Some advanced interactions may not work in sandboxed iframe

## What I'd Improve With More Time

1. **Database persistence**: Store versions in PostgreSQL/MongoDB for persistence
2. **Streaming responses**: Stream AI output for better UX during generation
3. **Diff view**: Show visual diff between versions
4. **More components**: Add form components, data viz, navigation patterns
5. **Component schema validation**: Validate props against TypeScript schemas
6. **Undo/redo**: Full undo/redo stack with keyboard shortcuts
7. **Export options**: Export to CodeSandbox, download as zip
8. **Collaborative editing**: Real-time collaboration with presence
9. **Template library**: Pre-built templates for common UI patterns
10. **Better error recovery**: More graceful handling of AI failures

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key (get free at console.groq.com) |

## Deployment

Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

Add `GROQ_API_KEY` to your Vercel environment variables.

## License

MIT
