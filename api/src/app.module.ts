import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SalesmanModule } from './salesman/salesman.module';
import { ClientMeetingModule } from './client_meeting/client_meeting.module';
import { ClientClassificationModule } from './client_classification/client_classification.module';
import { AiClassificationModule } from './ai-classification/ai-classification.module';
import { CsvParserModule } from './csv_parser/csv_parser.module';
import { SeedModule } from './seed/seed.module';
import { QueueModule } from './queue/queue.module';
import { KpiModule } from './kpi/kpi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    SalesmanModule,
    ClientMeetingModule,
    ClientClassificationModule,
    AiClassificationModule,
    CsvParserModule,
    SeedModule,
    QueueModule,
    KpiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
