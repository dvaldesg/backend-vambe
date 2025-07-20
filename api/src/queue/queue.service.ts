import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ClassificationProducer {

  constructor(@InjectQueue('classification') private queue: Queue) {}

  async enqueue(transcription: string, metadata: any) {
    try {
      const job = await this.queue.add('classify', { transcription, metadata });
      return job;
    } catch (error) {
      throw new Error('Failed to enqueue classification job');
    }
  }
}