import { Controller, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.login.dto';
import { Post,Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}
    @Post('login')
    @HttpCode(200)
    login(@Body() body:LoginDto) {
        return this.authService.login(
            body.username,
            body.password,
        )
    }
}
