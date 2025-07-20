import { Module } from '@nestjs/common';
import { ClientClassificationController } from './client_classification.controller';
import { ClientClassificationService } from './client_classification.service';

@Module({
  controllers: [ClientClassificationController],
  providers: [ClientClassificationService],
  exports: [ClientClassificationService]
})
export class ClientClassificationModule {}
