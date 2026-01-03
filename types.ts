
export type ProviderID = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'openrouter' | 'custom';

export enum AuthScheme {
  BEARER = 'Bearer',
  GOOGLE_KEY = 'x-goog-api-key',
  X_API_KEY = 'x-api-key',
  NONE = 'None'
}

export interface ProviderConfig {
  id: ProviderID;
  name: string;
  baseUrl: string;
  authScheme: AuthScheme;
  apiKey: string;
  extraHeaders: Record<string, string>;
  rememberKey: boolean;
}

export interface WebsiteCode {
  html: string;
  css: string;
  js: string;
}

export interface Project {
  id: string;
  timestamp: number;
  prompt: string;
  code: WebsiteCode;
  provider: ProviderID;
  model: string;
}

export type Language = 'en' | 'id';

export interface PromptConfig {
  prompt: string;
  model: string;
  temperature: number;
  image?: string; // Base64
}

export enum AppView {
  PROMPT = 'prompt',
  RESULT = 'result',
  EDITOR = 'editor',
  SETTINGS = 'settings'
}
