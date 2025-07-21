import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiClassificationModule } from '../ai-classification/ai-classification.module';

@Module({
  imports: [PrismaModule, AiClassificationModule],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule {}
