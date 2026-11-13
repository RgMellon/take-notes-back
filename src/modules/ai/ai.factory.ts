import { AiProvider } from './ai.interface';
import { GeminiProvider } from './gemini.provider';
import { OpenAiProvider } from './openai.provider';

export function aiProviderFactory(): AiProvider {
  const provider = process.env.AI_PROVIDER ?? 'gemini';

  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY ?? '';
    return new OpenAiProvider(apiKey);
  }

  const apiKey = process.env.GEMINI_API_KEY ?? '';
  return new GeminiProvider(apiKey);
}
