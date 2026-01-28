export type LLMProvider = "openai" | "anthropic";

export type OpenAIModel =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4-turbo"
  | "gpt-3.5-turbo";

export type AnthropicModel =
  | "claude-sonnet-4-20250514"
  | "claude-3-5-sonnet-latest"
  | "claude-3-5-haiku-latest"
  | "claude-3-opus-latest";

export type LLMModel = OpenAIModel | AnthropicModel;

export interface Settings {
  provider: LLMProvider;
  model: LLMModel;
  openaiApiKey: string;
  anthropicApiKey: string;
}

export const DEFAULT_SETTINGS: Settings = {
  provider: "openai",
  model: "gpt-4o-mini",
  openaiApiKey: "",
  anthropicApiKey: "",
};

export const OPENAI_MODELS: { value: OpenAIModel; label: string }[] = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
];

export const ANTHROPIC_MODELS: { value: AnthropicModel; label: string }[] = [
  { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
  { value: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet" },
  { value: "claude-3-5-haiku-latest", label: "Claude 3.5 Haiku" },
  { value: "claude-3-opus-latest", label: "Claude 3 Opus" },
];

export function getModelsForProvider(provider: LLMProvider) {
  return provider === "openai" ? OPENAI_MODELS : ANTHROPIC_MODELS;
}

export function getDefaultModelForProvider(provider: LLMProvider): LLMModel {
  return provider === "openai" ? "gpt-4o-mini" : "claude-3-5-sonnet-latest";
}
