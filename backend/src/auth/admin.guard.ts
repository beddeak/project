import { CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable } from "@nestjs/common";
import { Request } from "express";

type AuthenticatedRequest = Request & {
    user?: {
        sub:number;
        email:string;
        role:'user' | 'admin';
        name:string;
    };
};

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (request.user?.role !== 'admin') {
            throw new ForbiddenException('권한이 거부되었습니다')
        }
        
        return true;
    }
}
