import { Injectable,UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) {}
    async login(username: string,password:string) {
        const user = await this.usersService.findByUsername(username);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("아이디 혹은 비밀번호가 일치하지않습니다")
        }

        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    }
}
