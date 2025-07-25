import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { excludeHash } from '../utils';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async editUser(userId: number, dto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId 
            },
            data: {
                ...dto,
            }
        });

        return excludeHash(user);
    }
}
