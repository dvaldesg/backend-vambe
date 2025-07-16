import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { SalesmanService } from './salesman.service';
import { CreateSalesmanDto } from './dto';

@UseGuards(JwtGuard)
@Controller('salesmen')
export class SalesmanController {
    constructor(private salesmanService: SalesmanService) {}

    @Get()
    getSalesmen() {
        return this.salesmanService.getAllSalesmen();
    }

    @Post()
    createSalesman(@Body() dto: CreateSalesmanDto) {
        return this.salesmanService.createSalesman(dto);
    }

    @Get(':id')
    getSalesman(@Param('id', ParseIntPipe) id: number) {
        return this.salesmanService.getSalesmanById(id);
    }
}