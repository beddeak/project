import { IsNotEmpty,IsString,isString } from "class-validator";

export class UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    title!:string

    @IsString()
    @IsNotEmpty()
    content!:string
}