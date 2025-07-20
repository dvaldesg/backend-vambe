import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MeetingForClassificationDto } from './dto';
import { ClassificationProducer } from '../queue/queue.service';

@Injectable()
export class AiClassificationService {
  private readonly openai: OpenAI;

  constructor(
    config: ConfigService,
    private readonly producer: ClassificationProducer,
  ) {
    const apiKey = config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }


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
