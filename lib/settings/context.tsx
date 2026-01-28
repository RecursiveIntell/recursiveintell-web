"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Settings,
  type LLMProvider,
  type LLMModel,
  DEFAULT_SETTINGS,
  getDefaultModelForProvider,
} from "./types";

const STORAGE_KEY = "portfolio-settings";

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  setProvider: (provider: LLMProvider) => void;
  setModel: (model: LLMModel) => void;
  setOpenAIKey: (key: string) => void;
  setAnthropicKey: (key: string) => void;
  isConfigured: boolean;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Settings>;
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.error("Failed to save settings:", e);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const setProvider = useCallback((provider: LLMProvider) => {
    setSettings((prev) => ({
      ...prev,
      provider,
      model: getDefaultModelForProvider(provider),
    }));
  }, []);

  const setModel = useCallback((model: LLMModel) => {
    setSettings((prev) => ({ ...prev, model }));
  }, []);

  const setOpenAIKey = useCallback((key: string) => {
    setSettings((prev) => ({ ...prev, openaiApiKey: key }));
  }, []);

  const setAnthropicKey = useCallback((key: string) => {
    setSettings((prev) => ({ ...prev, anthropicApiKey: key }));
  }, []);

  const isConfigured =
    (settings.provider === "openai" && settings.openaiApiKey.length > 0) ||
    (settings.provider === "anthropic" && settings.anthropicApiKey.length > 0);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setProvider,
        setModel,
        setOpenAIKey,
        setAnthropicKey,
        isConfigured,
        isLoaded,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
