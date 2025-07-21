import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ClassificationProducer } from './queue.service';
import { ConfigService } from '@nestjs/config';

const config: ConfigService = new ConfigService();

const redisHost = config.get('REDIS_HOST');
const redisPort = config.get('REDIS_PORT');

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'classification',
      redis: {
        host: redisHost,
        port: redisPort,
      },
    }),
  ],
  providers: [ClassificationProducer],
  exports: [ClassificationProducer],
})
export class QueueModule {}