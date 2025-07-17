import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SalesmanModule } from './salesman/salesman.module';
import { ClientMeetingModule } from './client_meeting/client_meeting.module';

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
  ],
})
export class AppModule {}
