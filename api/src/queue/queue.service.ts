import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueDto } from './dto';

@Injectable()
export class ClassificationProducer {

  constructor(@InjectQueue('classification') private queue: Queue) {}

  async enqueue(queueDto: QueueDto) {

    const payload = {
      meetingId: queueDto.meetingId,
    };

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
