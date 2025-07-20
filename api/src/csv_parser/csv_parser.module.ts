import { Module } from '@nestjs/common';
import { CsvParserController } from './csv_parser.controller';
import { CsvParserService } from './csv_parser.service';

@Module({
  controllers: [CsvParserController],
  providers: [CsvParserService]
})
export class CsvParserModule {}
