"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { useSettings } from "@/lib/settings/context";
import { useChatContext } from "@/components/chat/ChatProvider";
import {
  type LLMProvider,
  type LLMModel,
  getModelsForProvider,
  OPENAI_MODELS,
  ANTHROPIC_MODELS,
} from "@/lib/settings/types";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}

function ApiKeyInput({
  label,
  value,
  onChange,
  placeholder,
  isActive,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isActive: boolean;
}) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--color-text)]">
        {label}
        {isActive && value && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckIcon className="h-3 w-3" />
            Active
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type={showKey ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-2.5 pr-12 font-mono text-sm text-[color:var(--color-text)] placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-accent)]"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]"
        >
          {showKey ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

function ProviderSelector({
  value,
  onChange,
}: {
  value: LLMProvider;
  onChange: (provider: LLMProvider) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[color:var(--color-text)]">
        LLM Provider
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("openai")}
          className={`rounded-lg border-2 px-4 py-3 text-left transition-colors ${
            value === "openai"
              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5"
              : "border-[color:var(--color-border)] hover:border-[color:var(--color-muted)]"
          }`}
        >
          <div className="font-medium text-[color:var(--color-text)]">
            OpenAI
          </div>
          <div className="text-xs text-[color:var(--color-muted)]">
            GPT-4o, GPT-4 Turbo
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange("anthropic")}
          className={`rounded-lg border-2 px-4 py-3 text-left transition-colors ${
            value === "anthropic"
              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5"
              : "border-[color:var(--color-border)] hover:border-[color:var(--color-muted)]"
          }`}
        >
          <div className="font-medium text-[color:var(--color-text)]">
            Anthropic
          </div>
          <div className="text-xs text-[color:var(--color-muted)]">
            Claude Sonnet 4, Opus
          </div>
        </button>
      </div>
    </div>
  );
}

function ModelSelector({
  provider,
  value,
  onChange,
}: {
  provider: LLMProvider;
  value: LLMModel;
  onChange: (model: LLMModel) => void;
}) {
  const models = getModelsForProvider(provider);

  // If current value isn't valid for the provider, show placeholder
  const isValidValue = models.some((m) => m.value === value);
  const displayValue = isValidValue ? value : "";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[color:var(--color-text)]">
        Model
      </label>
      <select
        value={displayValue}
        onChange={(e) => onChange(e.target.value as LLMModel)}
        className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-accent)]"
      >
        {!isValidValue && (
          <option value="" disabled>
            Select a model...
          </option>
        )}
        {models.map((model) => (
          <option key={model.value} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  );
}

export default function SettingsPage() {
  const {
    settings,
    setProvider,
    setModel,
    setOpenAIKey,
    setAnthropicKey,
    isConfigured,
    isLoaded,
  } = useSettings();
  const { toggleChat } = useChatContext();

  if (!isLoaded) {
    return (
      <div className="py-8">
        <Container>
          <PageHeader
            title="Settings"
            description="Configure your AI preferences"
          />
          <div className="mt-8 animate-pulse">
            <div className="h-64 rounded-lg bg-[color:var(--color-border)]" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <PageHeader
          title="Settings"
          description="Configure your AI preferences and API keys"
        />

        <div className="mt-8 max-w-2xl space-y-8">
          {/* Provider Selection */}
          <section className="rounded-xl border border-[color:var(--color-border)] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-[color:var(--color-text)]">
              AI Provider
            </h2>
            <div className="space-y-6">
              <ProviderSelector
                value={settings.provider}
                onChange={setProvider}
              />
              <ModelSelector
                provider={settings.provider}
                value={settings.model}
                onChange={setModel}
              />
            </div>
          </section>

          {/* API Keys */}
          <section className="rounded-xl border border-[color:var(--color-border)] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-[color:var(--color-text)]">
              API Keys
            </h2>
            <p className="mb-6 text-sm text-[color:var(--color-muted)]">
              Your API keys are stored locally in your browser and sent directly
              to the AI provider. They are never stored on our servers.
            </p>
            <div className="space-y-6">
              <ApiKeyInput
                label="OpenAI API Key"
                value={settings.openaiApiKey}
                onChange={setOpenAIKey}
                placeholder="sk-..."
                isActive={settings.provider === "openai"}
              />
              <ApiKeyInput
                label="Anthropic API Key"
                value={settings.anthropicApiKey}
                onChange={setAnthropicKey}
                placeholder="sk-ant-..."
                isActive={settings.provider === "anthropic"}
              />
            </div>
          </section>

          {/* Status */}
          <section
            className={`rounded-xl border p-4 ${
              isConfigured
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isConfigured ? (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-green-800">
                        Ready to chat
                      </div>
                      <div className="text-sm text-green-600">
                        Using {settings.provider === "openai" ? "OpenAI" : "Anthropic"}{" "}
                        with {settings.model}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                      <span className="text-lg">!</span>
                    </div>
                    <div>
                      <div className="font-medium text-amber-800">
                        API key required
                      </div>
                      <div className="text-sm text-amber-600">
                        Enter your{" "}
                        {settings.provider === "openai" ? "OpenAI" : "Anthropic"}{" "}
                        API key to enable chat
                      </div>
                    </div>
                  </>
                )}
              </div>
              {isConfigured && (
                <button
                  onClick={toggleChat}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  <ChatBubbleIcon className="h-4 w-4" />
                  Open Chat
                </button>
              )}
            </div>
          </section>

        </div>
      </Container>
    </div>
  );
}
