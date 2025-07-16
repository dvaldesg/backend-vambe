import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDto) {

        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                },
            })

            return user;

        } catch (error) {

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {

                    throw new ForbiddenException('Email already exists');
                }
            }

            throw error;
        }
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) throw new ForbiddenException('Credentials incorrect');
        
        const isPasswordValid = await argon.verify(user.hash, dto.password);
        
        if (!isPasswordValid) throw new ForbiddenException('Credentials incorrect');

        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
}
