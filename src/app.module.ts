import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SalesmanModule } from './salesman/salesman.module';
import { ClientMeetingModule } from './client_meeting/client_meeting.module';
import { ClientClassificationModule } from './client_classification/client_classification.module';
import { CsvParserModule } from './csv_parser/csv_parser.module';
import { SeedModule } from './seed/seed.module';

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
    CsvParserModule,
    SeedModule,
  ],
})
export class AppModule {}
