import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface JwtPayload {
    sub: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(config: ConfigService) {

        const jwtSecret = config.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in configuration');
        }
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload) {
        return { userId: payload.sub, email: payload.email };
    }
}
