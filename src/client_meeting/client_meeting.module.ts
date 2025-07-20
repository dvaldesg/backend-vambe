import { Module } from '@nestjs/common';
import { ClientMeetingController } from './client_meeting.controller';
import { ClientMeetingService } from './client_meeting.service';
import { AiClassificationModule } from '../ai-classification/ai-classification.module';

@Module({
  imports: [AiClassificationModule],
  controllers: [ClientMeetingController],
  providers: [ClientMeetingService]
})
export class ClientMeetingModule {}
