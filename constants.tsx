
import React from 'react';
import { ProviderID, AuthScheme, ProviderConfig, Language } from './types';

export const DEFAULT_PROVIDERS: Record<ProviderID, Partial<ProviderConfig>> = {
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    authScheme: AuthScheme.GOOGLE_KEY,
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    authScheme: AuthScheme.BEARER,
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    authScheme: AuthScheme.X_API_KEY,
  },
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    authScheme: AuthScheme.BEARER,
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    authScheme: AuthScheme.BEARER,
  },
  custom: {
    name: 'Custom Provider',
    baseUrl: '',
    authScheme: AuthScheme.BEARER,
  },
};

export const DEFAULT_MODELS: Record<ProviderID, string[]> = {
  gemini: ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash-lite-latest', 'gemini-2.5-flash-latest'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
  anthropic: ['claude-3-5-sonnet-latest', 'claude-3-opus-latest', 'claude-3-haiku-latest'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
  openrouter: ['google/gemini-2.0-flash-001', 'openai/gpt-4o-mini', 'anthropic/claude-3.5-sonnet'],
  custom: [],
};

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    title: 'Fluxo Static Website AI Generator',
    subtitle: 'Generate complete static websites from AI prompts.',
    promptPlaceholder: 'Describe your dream website (e.g., "A modern portfolio for a photographer with dark theme and a gallery section")...',
    generateBtn: 'Generate Website',
    generating: 'Brewing your website...',
    settings: 'Provider Settings',
    history: 'Past Projects',
    editMode: 'Continue Editing',
    backToPrompt: 'Back to Prompt',
    exportZip: 'Download ZIP',
    exportHtml: 'Single HTML',
    copy: 'Copy',
    copied: 'Copied!',
    appearance: 'Theme',
    language: 'Language',
    apiKeyLabel: 'Model API Key',
    baseUrlLabel: 'Base URL',
    modelLabel: 'Model',
    customModel: 'Custom Model Name',
    tempLabel: 'Temperature',
    refImage: 'Reference Image',
    refImageHint: 'Upload an image to guide the AI',
    saveSettings: 'Save Settings',
    resetData: 'Reset All Data',
    noHistory: 'No projects yet. Start generating!',
    editWithAI: 'Refine with AI',
    editAIPrompt: 'How should I improve this website?',
    applyEdit: 'Apply Changes',
  },
  id: {
    title: 'Fluxo Static Website AI Generator',
    subtitle: 'Hasilkan situs web statis lengkap dari prompt AI.',
    promptPlaceholder: 'Jelaskan situs web impian Anda (mis. "Portofolio modern untuk fotografer dengan tema gelap dan bagian galeri")...',
    generateBtn: 'Hasilkan Situs Web',
    generating: 'Sedang meracik situs web Anda...',
    settings: 'Pengaturan Provider',
    history: 'Proyek Terakhir',
    editMode: 'Lanjutkan Pengeditan',
    backToPrompt: 'Kembali ke Prompt',
    exportZip: 'Unduh ZIP',
    exportHtml: 'HTML Tunggal',
    copy: 'Salin',
    copied: 'Tersalin!',
    appearance: 'Tema',
    language: 'Bahasa',
    apiKeyLabel: 'API Key Model',
    baseUrlLabel: 'URL Dasar',
    modelLabel: 'Model',
    customModel: 'Nama Model Kustom',
    tempLabel: 'Temperatur',
    refImage: 'Gambar Referensi',
    refImageHint: 'Unggah gambar untuk memandu AI',
    saveSettings: 'Simpan Pengaturan',
    resetData: 'Hapus Semua Data',
    noHistory: 'Belum ada proyek. Mulai buat sekarang!',
    editWithAI: 'Sempurnakan dengan AI',
    editAIPrompt: 'Bagaimana saya harus memperbaiki situs ini?',
    applyEdit: 'Terapkan Perubahan',
  }
};

export const SYSTEM_PROMPT = `You are an expert web developer. Your task is to generate a complete, professional, and modern static website based on the user's description.
You MUST provide the response in three distinct Markdown code blocks:
1. index.html using \`\`\`html
2. styles.css using \`\`\`css
3. script.js using \`\`\`javascript (or \`\`\`js)

Ensure the HTML links to 'styles.css' and 'script.js'. Use modern styling.
DO NOT explain your process. ONLY provide the code blocks.
If the user provides an image, use it as design inspiration.`;
