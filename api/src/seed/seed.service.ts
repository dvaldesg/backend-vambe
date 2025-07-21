import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiClassificationService } from '../ai-classification/ai-classification.service';
import { processCsvFromBuffer, validateClientMeetingCsvRow } from '../utils';
import { CsvProcessingResultDto, ClientMeetingCsvDto } from '../utils/dto';
import { parseDate, isValidDate } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);
    
    constructor(
        private prisma: PrismaService,
        private aiClassificationService: AiClassificationService,
    ) {}

    async seedInitialData(): Promise<void> {
        try {           
            const existingMeetings = await this.prisma.clientMeeting.count();
            const existingSalesmen = await this.prisma.salesman.count();
            
            if (existingMeetings > 0 || existingSalesmen > 0) {
                return;
            }

            await this.seedFromCsvFile();
            
        } catch (error) {
            throw error;
        }
    }

    private async seedFromCsvFile(): Promise<void> {
        const csvFilePath = path.join(process.cwd(), 'prisma', 'seeds', 'initial-client-meetings.csv');
        
        if (!fs.existsSync(csvFilePath)) {
            return;
        }

        const buffer = fs.readFileSync(csvFilePath);
        const result: CsvProcessingResultDto<ClientMeetingCsvDto> = await processCsvFromBuffer(buffer, validateClientMeetingCsvRow);

        if (result.validRows === 0) {
            return;
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
                this.logger.error(`Error creating salesman ${salesmanName}:`, error);
            }
        }

        const createdMeetings: any[] = [];
        let enqueuedJobs = 0;
        
        for (const meetingData of result.data) {
            try {
                const existingMeeting = await this.prisma.clientMeeting.findFirst({
                    where: { 
                        name: meetingData.name,
                        email: meetingData.email,
                        salesmanName: meetingData.salesmanName,
                        date: parseDate(meetingData.date)
                    }
                });

                if (existingMeeting) {
                    continue;
                }

                const parsedDate = parseDate(meetingData.date);
                
                if (!isValidDate(parsedDate)) {
                    continue;
                }

                const salesman = await this.prisma.salesman.findFirst({
                    where: { name: meetingData.salesmanName }
                });

                if (!salesman) {
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

                if (meetingData.transcription && meetingData.transcription.trim().length > 0) {
                    try {
                        const classificationResult = await this.aiClassificationService.enqueueClassificationJob({
                            id: newMeeting.id,
                            name: newMeeting.name,
                            transcription: newMeeting.transcription!,
                            email: newMeeting.email,
                            phone: newMeeting.phone,
                        });
                        
                        this.logger.log(`Classification job enqueued for meeting ${newMeeting.id} with job ID: ${classificationResult.jobId}`);
                        enqueuedJobs++;
                    } catch (classificationError) {
                        this.logger.warn(`Failed to enqueue classification job for meeting ${newMeeting.id}:`, classificationError.message);
                    }
                }
                
            } catch (error) {
                this.logger.error(`Error creating meeting ${meetingData.name}:`, error);
            }
        }

        if (result.errors.length > 0) {
            this.logger.warn('CSV processing errors:', result.errors);
        }

        this.logger.log(`Seeding completed: ${createdSalesmen.length} salesmen created, ${createdMeetings.length} meetings created, ${enqueuedJobs} classification jobs enqueued`);
    }
}
