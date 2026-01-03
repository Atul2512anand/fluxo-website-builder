
import { GoogleGenAI } from "@google/genai";
import { ProviderConfig, PromptConfig, WebsiteCode, AuthScheme } from '../types';
import { SYSTEM_PROMPT } from '../constants';
import { parseLLMResponse } from '../utils/codeParser';

export async function generateWebsite(
  provider: ProviderConfig,
  config: PromptConfig,
  isEdit: boolean = false,
  currentCode?: WebsiteCode
): Promise<WebsiteCode> {
  const prompt = isEdit && currentCode 
    ? `You are editing an existing website.
Current Code:
HTML:
${currentCode.html}
CSS:
${currentCode.css}
JS:
${currentCode.js}

USER REFINEMENT REQUEST: ${config.prompt}

Please output the COMPLETE updated code blocks for HTML, CSS, and JS.`
    : config.prompt;

  if (provider.id === 'gemini') {
    return handleGemini(provider, config, prompt);
  } else {
    return handleGeneric(provider, config, prompt);
  }
}

async function handleGemini(provider: ProviderConfig, config: PromptConfig, prompt: string): Promise<WebsiteCode> {
  // As per instructions, the API key must be obtained exclusively from process.env.API_KEY
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing (process.env.API_KEY).");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const parts: any[] = [{ text: prompt }];
  if (config.image) {
    const base64Data = config.image.split(',')[1] || config.image;
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    });
  }

  const response = await ai.models.generateContent({
    model: config.model || 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: config.temperature,
    }
  });

  return parseLLMResponse(response.text || '');
}

async function handleGeneric(provider: ProviderConfig, config: PromptConfig, prompt: string): Promise<WebsiteCode> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...provider.extraHeaders,
  };

  // Prioritize user key from state, fallback to system key
  const effectiveApiKey = provider.apiKey || process.env.API_KEY || '';
  
  if (!effectiveApiKey) {
    throw new Error(`API Key for ${provider.name} is missing.`);
  }

  // Auth Header Handling
  if (provider.authScheme === AuthScheme.BEARER) {
    headers['Authorization'] = `Bearer ${effectiveApiKey}`;
  } else if (provider.authScheme === AuthScheme.X_API_KEY) {
    headers['x-api-key'] = effectiveApiKey;
  } else if (provider.authScheme === AuthScheme.GOOGLE_KEY) {
    headers['x-goog-api-key'] = effectiveApiKey;
  }

  // OpenRouter and some proxies require these for identification and to avoid 401/cookie issues
  if (provider.id === 'openrouter' || provider.baseUrl.includes('openrouter.ai')) {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Fluxo AI Generator';
  }

  let body: any = {};
  const isAnthropic = provider.id === 'anthropic' || provider.baseUrl.includes('anthropic.com');

  if (isAnthropic) {
    const messages: any[] = [{ role: 'user', content: prompt }];
    if (config.image) {
      const base64Data = config.image.split(',')[1] || config.image;
      messages[0].content = [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: base64Data,
          },
        },
        { type: "text", text: prompt }
      ];
    }
    body = {
      model: config.model,
      system: SYSTEM_PROMPT,
      messages: messages,
      max_tokens: 8192,
      temperature: config.temperature,
    };
  } else {
    // OpenAI, OpenRouter, Groq style
    body = {
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: config.temperature,
    };
  }

  const res = await fetch(provider.baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const raw = await res.text();

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} - ${raw.slice(0, 500)}`);
  }

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error("Failed to parse API response as JSON.");
  }

  let text = '';
  if (data.choices && data.choices[0]?.message?.content) {
    text = data.choices[0].message.content;
  } else if (data.content && data.content[0]?.text) {
    text = data.content[0].text;
  } else if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
    text = data.candidates[0].content.parts[0].text;
  }

  if (!text) {
    throw new Error("API returned an empty response or unexpected format.");
  }

  return parseLLMResponse(text);
}
