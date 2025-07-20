import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ClassificationProducer {

  constructor(@InjectQueue('classification') private queue: Queue) {}

  async enqueue(prompt: string, metadata: any) {
    const payload = {
      prompt,
      metadata,
    }
    try {
      const job = await this.queue.add(
        'classify',
        payload,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: true,
        }
      );
      return job;
    } catch (error) {
      throw new Error('Failed to enqueue classification job');
    }
  }
}