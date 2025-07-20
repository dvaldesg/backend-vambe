import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { processCsvFromBuffer, validateClientMeetingCsvRow } from '../utils';
import { CsvProcessingResultDto, ClientMeetingCsvDto } from '../utils/dto';
import { parseDate, isValidDate } from '../utils';
import { CsvProcessingResponseDto } from './dto';

@Injectable()
export class CsvParserService {
    constructor(private prisma: PrismaService) {}

    async processClientMeetingsCsv(buffer: Buffer): Promise<CsvProcessingResponseDto> {
        try {
            const result: CsvProcessingResultDto<ClientMeetingCsvDto> = await processCsvFromBuffer(buffer, validateClientMeetingCsvRow);

            if (result.validRows === 0) {
                throw new BadRequestException('No valid rows found in CSV file');
            }

            const uniqueSalesmenNames = [...new Set(result.data.map(row => row.salesmanName))];

            const createdSalesmen: any[] = [];
            for (const salesmanName of uniqueSalesmenNames) {
                try {
                    const existingSalesman = await this.prisma.salesman.findFirst({
                        where: { name: salesmanName }
                    });

                    if (!existingSalesman) {
                        const newSalesman = await this.prisma.salesman.create({
                            data: { name: salesmanName }
                        });
                        createdSalesmen.push(newSalesman);
                    }
                } catch (error) {
                    result.errors.push(`Error creating salesman ${salesmanName}: ${error.message}`);
                }
            }

            const createdMeetings: any[] = [];
            for (const meetingData of result.data) {
                try {
                    const parsedDate = parseDate(meetingData.date);
                    
                    if (!isValidDate(parsedDate)) {
                        result.errors.push(`Invalid date format for meeting ${meetingData.name}: ${meetingData.date}`);
                        continue;
                    }

                    const salesman = await this.prisma.salesman.findFirst({
                        where: { name: meetingData.salesmanName }
                    });

                    if (!salesman) {
                        result.errors.push(`Salesman not found for meeting ${meetingData.name}: ${meetingData.salesmanName}`);
                        continue;
                    }

                    const newMeeting = await this.prisma.clientMeeting.create({
                        data: {
                            name: meetingData.name,
                            email: meetingData.email,
                            phone: meetingData.phone,
                            salesmanName: meetingData.salesmanName,
                            salesmanId: salesman.id,
                            date: parsedDate,
                            closed: meetingData.closed,
                            transcription: meetingData.transcription,
                        }
                    });

                    createdMeetings.push(newMeeting);
                } catch (error) {
                    result.errors.push(`Error creating meeting ${meetingData.name}: ${error.message}`);
                }
            }

            return {
                message: `Successfully processed ${result.totalRows} rows. Created ${createdSalesmen.length} salesmen and ${createdMeetings.length} meetings.`,
                totalRows: result.totalRows,
                validRows: result.validRows,
                errors: result.errors,
                createdSalesmen,
                createdMeetings
            };

        } catch (error) {
            throw new BadRequestException(`Error processing CSV file: ${error.message}`);
        }
    }
}
