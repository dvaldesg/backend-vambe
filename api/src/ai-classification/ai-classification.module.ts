import { Module } from '@nestjs/common';
import { AiClassificationService } from './ai-classification.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [AiClassificationService],
  exports: [AiClassificationService],
})
export class AiClassificationModule {}
