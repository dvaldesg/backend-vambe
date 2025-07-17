import { Module } from '@nestjs/common';
import { ClientMeetingController } from './client_meeting.controller';
import { ClientMeetingService } from './client_meeting.service';

@Module({
  controllers: [ClientMeetingController],
  providers: [ClientMeetingService]
})
export class ClientMeetingModule {}
