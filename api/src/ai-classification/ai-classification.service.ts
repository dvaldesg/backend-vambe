import { Injectable } from '@nestjs/common';
import { MeetingForClassificationDto } from './dto';
import { ClassificationProducer } from '../queue/queue.service';

@Injectable()
export class AiClassificationService {

  constructor(private readonly producer: ClassificationProducer) {}

  async enqueueClassificationJob(meeting: MeetingForClassificationDto) {
    if (!meeting.transcription || meeting.transcription.trim().length === 0) {
      throw new Error('Meeting transcription is required for classification');
    }
    
    try {
      const job = await this.producer.enqueue(
        { meetingId: meeting.id }
      );

      return { status: 'enqueued', jobId: job.id };
    } catch (error) {
      console.error('Error enqueuing classification job:', error);
      throw new Error('Failed to enqueue classification job');
    }
  }
}
