import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AiClassificationService } from './ai-classification.service';
import { ClassificationConsumer } from './classification.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'classification',
    }),
  ],
  providers: [ClassificationConsumer, AiClassificationService],
  exports: [AiClassificationService],
})
export class AiClassificationModule {}
