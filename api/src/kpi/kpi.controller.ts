import { Controller, Get, UseGuards } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { JwtGuard } from '../auth/guard';
import { SectionCardsDto, ChartAreaInteractiveDto, NewLeadsDto, VambeReasonDto, LeadsSourceDto, CommercialSectorsDto } from './dto';

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
}
