import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientMeetingService {
    constructor(private prisma: PrismaService) {}

    async getAllClientMeetings() {
        return this.prisma.clientMeeting.findMany();
    }
}
