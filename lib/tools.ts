export type UseCase = "coding" | "writing" | "data" | "research" | "mixed"

export const USE_CASES: { id: UseCase; label: string }[] = [
  { id: "coding", label: "Coding" },
  { id: "writing", label: "Writing" },
  { id: "data", label: "Data" },
  { id: "research", label: "Research" },
  { id: "mixed", label: "Mixed" },
]

export type Plan = {
  id: string
  name: string
  price: number
  description?: string
}

export type Tool = {
  id: string
  name: string
  description: string
  plans: Plan[]
}

export const AI_TOOLS: Tool[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-powered coding assistant for faster development.",
    plans: [
      { id: "hobby", name: "Hobby", price: 0, description: "$0 per seat / month" },
      { id: "pro", name: "Pro", price: 20, description: "$20 per seat / month" },
      { id: "business", name: "Business", price: 40, description: "$40 per seat / month" },
      { id: "enterprise", name: "Enterprise", price: 100, description: "$100 per seat / month" },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "AI coding support directly in your editor.",
    plans: [
      { id: "individual", name: "Individual", price: 10, description: "$10 per seat / month" },
      { id: "business", name: "Business", price: 19, description: "$19 per seat / month" },
      { id: "enterprise", name: "Enterprise", price: 39, description: "$39 per seat / month" },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    description: "AI assistant for writing, reasoning, and research.",
    plans: [
      { id: "free", name: "Free", price: 0, description: "$0 per seat / month" },
      { id: "pro", name: "Pro", price: 20, description: "$20 per seat / month" },
      { id: "max", name: "Max", price: 100, description: "$100 per seat / month" },
      { id: "team", name: "Team", price: 30, description: "$30 per seat / month" },
      { id: "enterprise", name: "Enterprise", price: 60, description: "$60 per seat / month" },
      { id: "api-direct", name: "API Direct", price: 0, description: "$0 base, usage-based" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "AI assistant for chat, content creation, and automation.",
    plans: [
      { id: "plus", name: "Plus", price: 20, description: "$20 per seat / month" },
      { id: "team", name: "Team", price: 30, description: "$30 per seat / month" },
      { id: "enterprise", name: "Enterprise", price: 60, description: "$60 per seat / month" },
      { id: "api-direct", name: "API Direct", price: 0, description: "$0 base, usage-based" },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    description: "Usage-based AI infrastructure for custom workflows.",
    plans: [
      { id: "api-direct", name: "API Direct", price: 0, description: "$0 base, usage-based" },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    description: "Developer-grade AI API with usage-based pricing.",
    plans: [
      { id: "api-direct", name: "API Direct", price: 0, description: "$0 base, usage-based" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Advanced AI models for text and multimodal workflows.",
    plans: [
      { id: "pro", name: "Pro", price: 20, description: "$20 per seat / month" },
      { id: "ultra", name: "Ultra", price: 30, description: "$30 per seat / month" },
      { id: "api-direct", name: "API Direct", price: 0, description: "$0 base, usage-based" },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "AI productivity workspace for teams.",
    plans: [
      { id: "free", name: "Free", price: 0, description: "$0 per seat / month" },
      { id: "pro", name: "Pro", price: 15, description: "$15 per seat / month" },
      { id: "team", name: "Team", price: 35, description: "$35 per seat / month" },
    ],
  },
]
