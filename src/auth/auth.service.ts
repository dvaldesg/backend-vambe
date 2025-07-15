import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    signup() {
        return { message: 'User signed up successfully' };
    }

    signin() {
        return { message: 'User signed in successfully' };
    }
}
