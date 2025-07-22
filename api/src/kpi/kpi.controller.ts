import { Controller, Get, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { JwtGuard } from '../auth/guard';
import { SectionCardsDto, ChartAreaInteractiveDto, NewLeadsDto, VambeReasonDto, LeadsSourceDto, CommercialSectorsDto, LeadsSourceSuccessRateDto, CommercialSectorSuccessRateDto, SalesmanPerformanceDto, SalesmanSuccessRateDto } from './dto';

@UseGuards(JwtGuard)
@Controller('kpi')
export class KpiController {
    constructor(private kpiService: KpiService) {}

    @Get('section-cards')
    async getSectionCards(): Promise<SectionCardsDto> {
        return this.kpiService.getSectionCards();
    }

    @Get('chart-area-interactive')
    async getChartAreaInteractive(): Promise<ChartAreaInteractiveDto[]> {
        return this.kpiService.getChartAreaInteractive();
    }

    @Get('new-leads')
    async getNewLeads(): Promise<NewLeadsDto[]> {
        return this.kpiService.getNewLeads();
    }

    @Get('vambe-reason')
    async getVambeReason(): Promise<VambeReasonDto[]> {
        return this.kpiService.getVambeReason();
    }

    @Get('leads-source')
    async getLeadsSource(): Promise<LeadsSourceDto[]> {
        return this.kpiService.getLeadsSource();
    }

    @Get('commercial-sectors')
    async getCommercialSectors(): Promise<CommercialSectorsDto[]> {
        return this.kpiService.getCommercialSectors();
    }

    @Get('leads-source-success-rate')
    async getLeadsSourceSuccessRate(): Promise<LeadsSourceSuccessRateDto[]> {
        return this.kpiService.getLeadsSourceSuccessRate();
    }

    @Get('commercial-sector-success-rate')
    async getCommercialSectorSuccessRate(): Promise<CommercialSectorSuccessRateDto[]> {
        return this.kpiService.getCommercialSectorSuccessRate();
    }

    @Get('salesman-performance')
    async getSalesmanPerformance(): Promise<SalesmanPerformanceDto[]> {
        return this.kpiService.getSalesmanPerformance();
    }

    @Get('salesman-success-rate/:id')
    async getSalesmanSuccessRate(@Param('id', ParseIntPipe) salesmanId: number): Promise<SalesmanSuccessRateDto[]> {
        return this.kpiService.getSalesmanSuccessRate(salesmanId);
    }
}
