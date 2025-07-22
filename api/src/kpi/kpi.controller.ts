import { Controller, Get, UseGuards } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { JwtGuard } from '../auth/guard';
import { SectionCardsDto, ChartAreaInteractiveDto } from './dto';

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
}
