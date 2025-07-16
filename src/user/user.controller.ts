import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from 'generated/prisma';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { excludeHash } from '../utils';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        return excludeHash(user);
    }

    @Patch('me')
    editMe(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }
}
