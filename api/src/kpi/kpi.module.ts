import { Module } from '@nestjs/common';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TrendingService, CalculationService } from './services';

@Module({
  imports: [PrismaModule],
  controllers: [KpiController],
  providers: [KpiService, TrendingService, CalculationService]
})
export class KpiModule {}
