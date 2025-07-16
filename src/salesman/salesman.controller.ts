import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { SalesmanService } from './salesman.service';
import { SalesmanDto } from './dto';

@UseGuards(JwtGuard)
@Controller('salesmen')
export class SalesmanController {
    constructor(private salesmanService: SalesmanService) {}

    @Get()
    getSalesman() {
        return this.salesmanService.getAllSalesmen();
    }

    @Post()
    createSalesman(@Body() dto: SalesmanDto) {
        return this.salesmanService.createSalesman(dto);
    }
}