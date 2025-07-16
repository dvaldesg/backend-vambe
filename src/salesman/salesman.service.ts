import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SalesmanDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SalesmanService {
    constructor(private prisma: PrismaService) {}

    async getAllSalesmen() {
        const salesmen = await this.prisma.salesman.findMany();
        return salesmen;
    }

    async createSalesman(dto: SalesmanDto) {

        const salesman = await this.prisma.salesman.findMany({
            where: {
                name: dto.name,
            },
        });

        if (salesman.length > 0) throw new ForbiddenException('Salesman with this name already exists');

        try {
            const newSalesman = await this.prisma.salesman.create({
                data: {
                    name: dto.name,
                }
            })

            return newSalesman;

        } catch (error) {

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {

                    throw new ForbiddenException('Salesman with this name already exists');
                }
            }

            throw error;
        }
    }
}
