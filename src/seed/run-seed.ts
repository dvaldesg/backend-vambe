import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function runSeed() {
  const app = await NestFactory.create(AppModule);
  const seedService = app.get(SeedService);
  
  try {
    await seedService.seedInitialData();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeed();
