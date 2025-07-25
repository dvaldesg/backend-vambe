import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signUp(dto: AuthDto) {

        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (user) throw new ForbiddenException('Credentials email already exists');

        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                }
            })

            return this.signToken(user.id, user.email);

        } catch (error) {

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {

                    throw new ForbiddenException('Email already exists');
                }
            }

            throw error;
        }
    }

    async signIn(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) throw new ForbiddenException('Credentials incorrect');
        
        const isPasswordValid = await argon.verify(user.hash, dto.password);
        
        if (!isPasswordValid) throw new ForbiddenException('Credentials incorrect');

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        }

        const secret = this.config.get<string>('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '1h',
            secret: secret,
        });

        return {
            access_token: token,
        };
    }
}
