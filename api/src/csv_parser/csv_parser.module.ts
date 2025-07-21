import { Module } from '@nestjs/common';
import { CsvParserController } from './csv_parser.controller';
import { CsvParserService } from './csv_parser.service';
import { AiClassificationModule } from '../ai-classification/ai-classification.module';


@Module({
  imports: [AiClassificationModule],
  controllers: [CsvParserController],
  providers: [CsvParserService]
})
export class CsvParserModule {}
