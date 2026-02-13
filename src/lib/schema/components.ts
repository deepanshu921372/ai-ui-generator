export interface PropSchema {
  type: "string" | "boolean" | "enum" | "number" | "array" | "object" | "ReactNode";
  values?: string[];
  default?: string | boolean | number;
  required?: boolean;
  description?: string;
}

export interface ComponentSchema {
  componentName: string;
  description: string;
  props: Record<string, PropSchema>;
  examples: string[];
}

export const componentSchemas: ComponentSchema[] = [
  {
    componentName: "Button",
    description: "A clickable button element with fixed style variants",
    props: {
      variant: {
        type: "enum",
        values: ["primary", "secondary", "outline", "danger", "ghost"],
        default: "primary",
        description: "Visual style of the button",
      },
      size: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
      },
      disabled: {
        type: "boolean",
        default: false,
      },
      children: {
        type: "string",
        required: true,
        description: "Button label text",
      },
    },
    examples: [
      '<Button variant="primary" size="lg">Submit</Button>',
      '<Button variant="danger" size="sm">Delete</Button>',
    ],
  },
  {
    componentName: "Card",
    description: "Content container with optional header",
    props: {
      title: { type: "string", description: "Card title" },
      subtitle: { type: "string", description: "Card subtitle" },
      padding: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
      },
      children: { type: "ReactNode" },
    },
    examples: [
      '<Card title="Statistics" subtitle="Monthly overview">Content here</Card>',
    ],
  },
  {
    componentName: "Input",
    description: "Form input field with label and helper text",
    props: {
      label: { type: "string" },
      placeholder: { type: "string" },
      type: {
        type: "enum",
        values: ["text", "email", "password", "number"],
        default: "text",
      },
      required: { type: "boolean", default: false },
      helperText: { type: "string" },
    },
    examples: [
      '<Input label="Email" type="email" placeholder="Enter your email" required />',
    ],
  },
  {
    componentName: "Table",
    description: "Data table with headers and rows",
    props: {
      columns: {
        type: "array",
        description: 'Array of {key: string, header: string}',
        required: true,
      },
      data: {
        type: "array",
        description: "Array of row objects",
        required: true,
      },
      striped: { type: "boolean", default: false },
      hoverable: { type: "boolean", default: false },
    },
    examples: [
      '<Table columns={[{key: "name", header: "Name"}]} data={[{name: "John"}]} striped hoverable />',
    ],
  },
  {
    componentName: "Modal",
    description: "Overlay modal dialog",
    props: {
      title: { type: "string", required: true },
      isOpen: { type: "boolean", required: true },
      size: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
      },
      children: { type: "ReactNode" },
    },
    examples: ['<Modal title="Settings" isOpen={true}>Modal content</Modal>'],
  },
  {
    componentName: "Sidebar",
    description: "Vertical navigation sidebar",
    props: {
      items: {
        type: "array",
        description: 'Array of {label: string, icon?: string, href?: string, active?: boolean}',
        required: true,
      },
      collapsed: { type: "boolean", default: false },
      title: { type: "string" },
    },
    examples: [
      '<Sidebar title="Menu" items={[{label: "Dashboard", active: true}]} />',
    ],
  },
  {
    componentName: "Navbar",
    description: "Horizontal top navigation bar",
    props: {
      brand: { type: "string", required: true },
      items: {
        type: "array",
        description: 'Array of {label: string, href?: string, active?: boolean}',
      },
      actions: { type: "ReactNode" },
    },
    examples: ['<Navbar brand="MyApp" items={[{label: "Home", active: true}]} />'],
  },
  {
    componentName: "Chart",
    description: "Data visualization chart",
    props: {
      type: {
        type: "enum",
        values: ["bar", "line", "pie", "area"],
        required: true,
      },
      data: {
        type: "array",
        description: 'Array of {name: string, value: number}',
        required: true,
      },
      title: { type: "string" },
      xLabel: { type: "string" },
      yLabel: { type: "string" },
    },
    examples: [
      '<Chart type="bar" data={[{name: "Jan", value: 100}]} title="Sales" />',
    ],
  },
  {
    componentName: "Badge",
    description: "Status indicator label",
    props: {
      text: { type: "string", required: true },
      variant: {
        type: "enum",
        values: ["info", "success", "warning", "error"],
        default: "info",
      },
    },
    examples: ['<Badge text="Active" variant="success" />'],
  },
  {
    componentName: "Avatar",
    description: "User avatar with fallback initials",
    props: {
      name: { type: "string", required: true },
      size: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
      },
      src: { type: "string" },
    },
    examples: ['<Avatar name="John Doe" size="lg" />'],
  },
  {
    componentName: "Tabs",
    description: "Tabbed content switcher",
    props: {
      items: {
        type: "array",
        description: 'Array of {id: string, label: string, content: ReactNode}',
        required: true,
      },
      defaultTab: { type: "string" },
    },
    examples: [
      '<Tabs items={[{id: "tab1", label: "Tab 1", content: <div>Content</div>}]} defaultTab="tab1" />',
    ],
  },
  {
    componentName: "Alert",
    description: "Notification/alert banner",
    props: {
      type: {
        type: "enum",
        values: ["info", "success", "warning", "error"],
        default: "info",
      },
      title: { type: "string" },
      message: { type: "string", required: true },
      dismissible: { type: "boolean", default: false },
    },
    examples: [
      '<Alert type="success" title="Success" message="Operation completed" dismissible />',
    ],
  },
  {
    componentName: "Dropdown",
    description: "Dropdown menu",
    props: {
      label: { type: "string", required: true },
      items: {
        type: "array",
        description: 'Array of {label: string, value: string}',
        required: true,
      },
      variant: {
        type: "enum",
        values: ["default", "outline"],
        default: "default",
      },
    },
    examples: [
      '<Dropdown label="Options" items={[{label: "Edit", value: "edit"}]} />',
    ],
  },
  {
    componentName: "Divider",
    description: "Visual separator",
    props: {
      orientation: {
        type: "enum",
        values: ["horizontal", "vertical"],
        default: "horizontal",
      },
      spacing: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
      },
    },
    examples: ['<Divider orientation="horizontal" spacing="md" />'],
  },
  {
    componentName: "Text",
    description: "Typography element",
    props: {
      variant: {
        type: "enum",
        values: ["h1", "h2", "h3", "body", "caption", "label"],
        default: "body",
      },
      weight: {
        type: "enum",
        values: ["normal", "medium", "bold"],
        default: "normal",
      },
      children: { type: "string", required: true },
    },
    examples: ['<Text variant="h1" weight="bold">Hello World</Text>'],
  },
  {
    componentName: "Stat",
    description: "Single stat/metric display",
    props: {
      label: { type: "string", required: true },
      value: { type: "string", required: true },
      change: { type: "string" },
      trend: {
        type: "enum",
        values: ["up", "down", "neutral"],
        default: "neutral",
      },
    },
    examples: ['<Stat label="Revenue" value="$12,345" change="+12%" trend="up" />'],
  },
  // Layout Primitives
  {
    componentName: "Stack",
    description: "Flexbox container for stacking elements",
    props: {
      direction: {
        type: "enum",
        values: ["horizontal", "vertical"],
        default: "vertical",
      },
      gap: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
      },
      align: {
        type: "enum",
        values: ["start", "center", "end", "stretch"],
        default: "stretch",
      },
      wrap: { type: "boolean", default: false },
      children: { type: "ReactNode" },
    },
    examples: ['<Stack direction="horizontal" gap="md" align="center">...</Stack>'],
  },
  {
    componentName: "Grid",
    description: "CSS Grid container",
    props: {
      columns: {
        type: "enum",
        values: ["1", "2", "3", "4"],
        default: "1",
      },
      gap: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
      },
      children: { type: "ReactNode" },
    },
    examples: ['<Grid columns={3} gap="md">...</Grid>'],
  },
  {
    componentName: "Container",
    description: "Centered content wrapper",
    props: {
      maxWidth: {
        type: "enum",
        values: ["sm", "md", "lg", "full"],
        default: "lg",
      },
      padding: {
        type: "enum",
        values: ["sm", "md", "lg"],
        default: "md",
      },
      children: { type: "ReactNode" },
    },
    examples: ['<Container maxWidth="lg" padding="md">...</Container>'],
  },
  {
    componentName: "Page",
    description: "Root page wrapper with background",
    props: {
      children: { type: "ReactNode" },
    },
    examples: ["<Page>...</Page>"],
  },
];

export const componentWhitelist = componentSchemas.map((c) => c.componentName);

export function getComponentSchemaString(): string {
  return JSON.stringify(componentSchemas, null, 2);
}
