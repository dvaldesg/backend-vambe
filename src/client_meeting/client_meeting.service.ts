import { ForbiddenException, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientMeetingDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { parseDate, isValidDate } from '../utils';

@Injectable()
export class ClientMeetingService {
    constructor(private prisma: PrismaService) {}

    async getAllClientMeetings() {
        return this.prisma.clientMeeting.findMany();
    }

    async createClientMeeting(dto: ClientMeetingDto) {
        try {
            const parsedDate = parseDate(dto.date);
            
            if (!isValidDate(parsedDate)) {
                throw new BadRequestException('Invalid date format provided');
            }

            const salesman = await this.prisma.salesman.findFirst({
                where: { name: dto.salesmanName }
            });

            if (!salesman) {
                throw new BadRequestException('Salesman with the provided name does not exist');
            }
            
            const newClientMeeting = await this.prisma.clientMeeting.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,
                    salesmanName: dto.salesmanName,
                    salesmanId: salesman.id,
                    date: parsedDate,
                    closed: dto.closed,
                    transcription: dto.transcription,
                }
            })

            return newClientMeeting;

        } catch (error) {
            if (error.message && error.message.includes('Invalid date format')) {
                throw new BadRequestException(error.message);
            }

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Client meeting with this name already exists');
                }
                if (error.code === 'P2003') {
                    throw new BadRequestException('Invalid salesmanName provided');
                }
            }

            throw error;
        }
    }
}
