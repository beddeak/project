import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express';


type JwtPayload = {
    sub: number;
    email:string;
    role:'user' | 'admin';
    name:string;
}

type AuthenticatedRequest = Request & {
    user?: JwtPayload
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException("로그인이 필요합니다")
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException("올바르지 않은 인증 형식입니다")
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
            request.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException("토큰이 유효하지 않습니다")
        }
    }
 }