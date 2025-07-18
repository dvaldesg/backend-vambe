import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientClassificationService } from './client_classification.service';
import { JwtGuard } from '../auth/guard';
import { CreateClientClassificationDto, UpdateClientClassificationDto } from './dto';

@UseGuards(JwtGuard)
@Controller('client-classifications')
export class ClientClassificationController {
    constructor(private clientClassificationService: ClientClassificationService) {}

    @Get('all')
    async getAllClientClassifications() {
        return this.clientClassificationService.getAllClientClassifications();
    }

    @Get(':id')
    async getClientClassificationById(@Param('id', ParseIntPipe) id: number) {
        return this.clientClassificationService.getClientClassificationById(id);
    }

    @Get('meeting/:meetingId')
    async getClientClassificationByMeetingId(@Param('meetingId', ParseIntPipe) meetingId: number) {
        return this.clientClassificationService.getClientClassificationByMeetingId(meetingId);
    }

    @Post()
    async createClientClassification(@Body() dto: CreateClientClassificationDto) {
        return this.clientClassificationService.createClientClassification(dto);
    }

    @Patch(':id')
    async updateClientClassification(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateClientClassificationDto
    ) {
        return this.clientClassificationService.updateClientClassification(id, dto);
    }

    @Delete(':id')
    async deleteClientClassification(@Param('id', ParseIntPipe) id: number) {
        return this.clientClassificationService.deleteClientClassification(id);
    }
}
