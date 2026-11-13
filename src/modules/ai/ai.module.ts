import { Module } from '@nestjs/common';
import { aiProviderFactory } from './ai.factory';
import { AI_PROVIDER_TOKEN } from './ai.interface';

@Module({
  providers: [
    {
      provide: AI_PROVIDER_TOKEN,
      useFactory: aiProviderFactory,
    },
  ],
  exports: [AI_PROVIDER_TOKEN],
})
export class AiModule {}
