import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientClassificationDto, UpdateClientClassificationDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ClientClassificationService {
    constructor(private prisma: PrismaService) {}

    async getAllClientClassifications() {
        return this.prisma.clientClassification.findMany({
            include: {
                clientMeeting: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        salesmanName: true,
                        date: true,
                        closed: true
                    }
                }
            }
        });
    }

    async getClientClassificationById(id: number) {
        const classification = await this.prisma.clientClassification.findUnique({
            where: { id },
            include: {
                clientMeeting: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        salesmanName: true,
                        date: true,
                        closed: true
                    }
                }
            }
        });

        if (!classification) {
            throw new NotFoundException('Client classification not found');
        }

        return classification;
    }

    async getClientClassificationByMeetingId(clientMeetingId: number) {
        const classification = await this.prisma.clientClassification.findUnique({
            where: { clientMeetingId },
            include: {
                clientMeeting: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        salesmanName: true,
                        date: true,
                        closed: true
                    }
                }
            }
        });

        if (!classification) {
            throw new NotFoundException('Client classification not found for this meeting');
        }

        return classification;
    }

    async createClientClassification(dto: CreateClientClassificationDto) {
        try {
            const clientMeeting = await this.prisma.clientMeeting.findUnique({
                where: { id: dto.clientMeetingId }
            });

            if (!clientMeeting) {
                throw new BadRequestException('Client meeting with the provided ID does not exist');
            }

            const existingClassification = await this.prisma.clientClassification.findUnique({
                where: { clientMeetingId: dto.clientMeetingId }
            });

            if (existingClassification) {
                throw new BadRequestException('A classification already exists for this client meeting');
            }

            const newClassification = await this.prisma.clientClassification.create({
                data: {
                    clientMeetingId: dto.clientMeetingId,
                    commercialSector: dto.commercialSector,
                    leadSource: dto.leadSource,
                    interestReason: dto.interestReason,
                    hasDemandPeaks: dto.hasDemandPeaks ?? false,
                    hasSeasonalDemand: dto.hasSeasonalDemand ?? false,
                    estimatedDailyInteractions: dto.estimatedDailyInteractions ?? 0,
                    estimatedWeeklyInteractions: dto.estimatedWeeklyInteractions ?? 0,
                    estimatedMonthlyInteractions: dto.estimatedMonthlyInteractions ?? 0,
                    hasTechTeam: dto.hasTechTeam ?? false,
                    vambeModel: dto.vambeModel,
                    isPotentialClient: dto.isPotentialClient ?? false,
                    isProblemClient: dto.isProblemClient ?? false,
                    isLostClient: dto.isLostClient ?? false,
                    shouldBeContacted: dto.shouldBeContacted ?? false,
                    confidenceScore: dto.confidenceScore,
                    modelVersion: dto.modelVersion
                },
                include: {
                    clientMeeting: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            salesmanName: true,
                            date: true,
                            closed: true
                        }
                    }
                }
            });

            return newClassification;

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('A classification already exists for this client meeting');
                }
                if (error.code === 'P2003') {
                    throw new BadRequestException('Invalid clientMeetingId provided');
                }
            }

            throw error;
        }
    }

    async updateClientClassification(id: number, dto: UpdateClientClassificationDto) {
        try {
            const existingClassification = await this.prisma.clientClassification.findUnique({
                where: { id }
            });

            if (!existingClassification) {
                throw new NotFoundException('Client classification not found');
            }

            const updatedClassification = await this.prisma.clientClassification.update({
                where: { id },
                data: {
                    commercialSector: dto.commercialSector,
                    leadSource: dto.leadSource,
                    interestReason: dto.interestReason,
                    hasDemandPeaks: dto.hasDemandPeaks,
                    hasSeasonalDemand: dto.hasSeasonalDemand,
                    estimatedDailyInteractions: dto.estimatedDailyInteractions,
                    estimatedWeeklyInteractions: dto.estimatedWeeklyInteractions,
                    estimatedMonthlyInteractions: dto.estimatedMonthlyInteractions,
                    hasTechTeam: dto.hasTechTeam,
                    vambeModel: dto.vambeModel,
                    isPotentialClient: dto.isPotentialClient,
                    isProblemClient: dto.isProblemClient,
                    isLostClient: dto.isLostClient,
                    shouldBeContacted: dto.shouldBeContacted,
                    confidenceScore: dto.confidenceScore,
                    modelVersion: dto.modelVersion
                },
                include: {
                    clientMeeting: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            salesmanName: true,
                            date: true,
                            closed: true
                        }
                    }
                }
            });

            return updatedClassification;

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Client classification not found');
                }
            }

            throw error;
        }
    }

    async deleteClientClassification(id: number) {
        try {
            const classification = await this.prisma.clientClassification.findUnique({
                where: { id }
            });

            if (!classification) {
                throw new NotFoundException('Client classification not found');
            }

            await this.prisma.clientClassification.delete({
                where: { id }
            });

            return { message: 'Client classification deleted successfully' };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Client classification not found');
                }
            }

            throw error;
        }
    }
}
