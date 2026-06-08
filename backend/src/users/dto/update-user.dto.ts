import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength,IsOptional, isNotEmpty } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsOptional()
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty()
    @IsString()
    username!:string

    @IsOptional()
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty()
    @IsEmail()
    email!:string

    @IsOptional()
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty()
    @MinLength(4)
    @IsString()
    password!:string
}