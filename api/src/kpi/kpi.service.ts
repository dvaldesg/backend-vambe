import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SectionCardsDto, ChartAreaInteractiveDto, NewLeadsDto, VambeReasonDto, LeadsSourceDto, CommercialSectorsDto, LeadsSourceSuccessRateDto, CommercialSectorSuccessRateDto } from './dto';
import { TrendingService, CalculationService } from './services';

@Injectable()
export class KpiService {
    constructor(
        private prisma: PrismaService,
        private trendingService: TrendingService,
        private calculationService: CalculationService
    ) {}

    async getSectionCards(): Promise<SectionCardsDto> {
        const totalClientMeetings = await this.prisma.clientMeeting.count();

        const totalClosings = await this.prisma.clientMeeting.count({
            where: { closed: true }
        });

        const closingRate = totalClientMeetings > 0 
            ? Math.round((totalClosings / totalClientMeetings) * 100 * 100) / 100
            : 0;

        const averageClosingsPerMonth = await this.calculationService.calculateAverageClosingsPerMonth();

        const totalClientMeetingsTrendingResult = await this.trendingService.calculateTrending('totalMeetings');
        const totalClosingsTrendingResult = await this.trendingService.calculateTrending('totalClosings');
        const closingRateTrendingResult = await this.trendingService.calculateTrending('closingRate');
        const averageClosingsPerMonthTrendingResult = await this.trendingService.calculateTrending('averageClosings');

        return {
            totalClientMeetings,
            totalClientMeetingsTrending: totalClientMeetingsTrendingResult.direction,
            totalClientMeetingsTrendingValue: totalClientMeetingsTrendingResult.value,
            totalClosings,
            totalClosingsTrending: totalClosingsTrendingResult.direction,
            totalClosingsTrendingValue: totalClosingsTrendingResult.value,
            closingRate,
            closingRateTrending: closingRateTrendingResult.direction,
            closingRateTrendingValue: closingRateTrendingResult.value,
            averageClosingsPerMonth,
            averageClosingsPerMonthTrending: averageClosingsPerMonthTrendingResult.direction,
            averageClosingsPerMonthTrendingValue: averageClosingsPerMonthTrendingResult.value
        };
    }

    async getChartAreaInteractive(): Promise<ChartAreaInteractiveDto[]> {
        return this.calculationService.getChartAreaData();
    }

    async getNewLeads(): Promise<NewLeadsDto[]> {
        return this.calculationService.getNewLeadsData();
    }

    async getVambeReason(): Promise<VambeReasonDto[]> {
        return this.calculationService.getVambeReasonData();
    }

    async getLeadsSource(): Promise<LeadsSourceDto[]> {
    return this.calculationService.getLeadsSourceData();
  }

  async getCommercialSectors(): Promise<CommercialSectorsDto[]> {
    return this.calculationService.getCommercialSectorsData();
  }

  async getLeadsSourceSuccessRate(): Promise<LeadsSourceSuccessRateDto[]> {
    return this.calculationService.getLeadsSourceSuccessRateData();
  }

  async getCommercialSectorSuccessRate(): Promise<CommercialSectorSuccessRateDto[]> {
    return this.calculationService.getCommercialSectorSuccessRateData();
  }
}
