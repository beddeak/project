import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsNotEmpty()
    @IsString()
    name!: string;

    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsNotEmpty()
    @IsString()
    username!: string;

    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password!: string;
}