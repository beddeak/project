import { IsInt,IsNotEmpty,IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateCommentDto {
    @IsInt()
    postId!:number

    @Transform(({value}) => typeof value === 'string' ? value.trim(): value)
    @IsNotEmpty()
    @IsString()
    content!:string

    @IsInt()
    authorId!:number

    @Transform(({value}) => typeof value === 'string' ? value.trim(): value)
    @IsNotEmpty()
    @IsString()
    authorName!:string
}