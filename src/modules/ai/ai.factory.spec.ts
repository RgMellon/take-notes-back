import { aiProviderFactory } from './ai.factory';
import { GeminiProvider } from './gemini.provider';
import { OpenAiProvider } from './openai.provider';

describe('aiProviderFactory', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return GeminiProvider when AI_PROVIDER=gemini', () => {
    process.env.AI_PROVIDER = 'gemini';
    process.env.GEMINI_API_KEY = 'test-key';
    const provider = aiProviderFactory();
    expect(provider).toBeInstanceOf(GeminiProvider);
  });

  it('should return GeminiProvider by default when AI_PROVIDER is not set', () => {
    delete process.env.AI_PROVIDER;
    const provider = aiProviderFactory();
    expect(provider).toBeInstanceOf(GeminiProvider);
  });

  it('should return OpenAiProvider when AI_PROVIDER=openai', () => {
    process.env.AI_PROVIDER = 'openai';
    process.env.OPENAI_API_KEY = 'test-key';
    const provider = aiProviderFactory();
    expect(provider).toBeInstanceOf(OpenAiProvider);
  });

  it('GeminiProvider should have generateStructuredMarkdown method', () => {
    const provider = new GeminiProvider('test-key');
    expect(typeof provider.generateStructuredMarkdown).toBe('function');
  });

  it('OpenAiProvider should have generateStructuredMarkdown method', () => {
    const provider = new OpenAiProvider('test-key');
    expect(typeof provider.generateStructuredMarkdown).toBe('function');
  });
});
