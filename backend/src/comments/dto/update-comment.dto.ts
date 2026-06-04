import { Transform } from "class-transformer";
import { IsInt,IsString,IsNotEmpty } from "class-validator";

export class UpdateCommentDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim(): value)
    @IsString()
    @IsNotEmpty()
    content!:string;
}