import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { AiClassificationService } from './ai-classification.service';

export interface ClassificationJobData {
  meetingId: number;
}

@Processor('classification')
export class ClassificationConsumer {

  constructor(private readonly aiClassificationService: AiClassificationService) {}

  @Process('classify')
  async handleClassification(job: Job<ClassificationJobData>) {

    try {
      await this.aiClassificationService.processClassificationJob(job.data);
    } catch (error) {
      throw error;
    }
  }
}
