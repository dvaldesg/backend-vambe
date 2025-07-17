import { Module } from '@nestjs/common';
import { SalesmanController } from './salesman.controller';
import { SalesmanService } from './salesman.service';

@Module({
  controllers: [SalesmanController],
  providers: [SalesmanService]
})
export class SalesmanModule {}
