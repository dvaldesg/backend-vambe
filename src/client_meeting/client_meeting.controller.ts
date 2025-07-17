import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientMeetingService } from './client_meeting.service';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('client-meetings')
export class ClientMeetingController {
    constructor(private clientMeeting: ClientMeetingService) {}

    @Get('all')
    async getClientMeetings() {
        return this.clientMeeting.getAllClientMeetings();
    }
}
