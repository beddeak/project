import { Transform } from "class-transformer";
import { IsNotEmpty,IsString } from "class-validator";

export class LoginDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim(): value)
    @IsNotEmpty()
    @IsString()
    username!:string;
    @Transform(({value}) => typeof value === 'string' ? value.trim(): value)
    @IsNotEmpty()
    @IsString()
    password!:string;
}