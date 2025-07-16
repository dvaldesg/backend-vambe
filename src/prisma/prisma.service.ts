import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get<string>('DATABASE_URL'),
                },
            },
        });
    }

    cleanDb() {
        return this.$transaction([
            this.user.deleteMany(),
            this.salesman.deleteMany(),
        ]);
    }
}
