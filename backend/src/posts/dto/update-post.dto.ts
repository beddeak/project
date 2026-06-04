import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePostDto {
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    title!:string

    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    content!:string
}
