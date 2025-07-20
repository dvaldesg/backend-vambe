import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard';
import { CsvParserService } from './csv_parser.service';

@UseGuards(JwtGuard)
@Controller('csv-parser')
export class CsvParserController {
    constructor(private csvParserService: CsvParserService) {}

    @Post('client-meetings')
    @UseInterceptors(FileInterceptor('file'))
    async uploadClientMeetingsCsv(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        if (!file.originalname.endsWith('.csv')) {
            throw new BadRequestException('Only CSV files are allowed');
        }

        return this.csvParserService.processClientMeetingsCsv(file.buffer);
    }
}
