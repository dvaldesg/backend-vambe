import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClientMeetingService } from './client_meeting.service';
import { JwtGuard } from '../auth/guard';
import { ClientMeetingDto } from './dto';

@UseGuards(JwtGuard)
@Controller('client-meetings')
export class ClientMeetingController {
    constructor(private clientMeeting: ClientMeetingService) {}

    @Get('all')
    async getClientMeetings() {
        return this.clientMeeting.getAllClientMeetings();
    }

    @Post()
    async createClientMeeting(@Body() dto: ClientMeetingDto) {
        return this.clientMeeting.createClientMeeting(dto);
    }
}
