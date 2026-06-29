import { Transform } from "class-transformer";
import { IsInt,IsString,IsNotEmpty,IsIn, IsOptional } from "class-validator";

export class CreateReportDto {
    @Transform(({value}) => typeof value === 'string' ? value.trim(): value)
    @IsString()
    @IsNotEmpty()
    content!:string;
    @IsIn(["post", "comment"])
    targetType!: "post" | "comment";
    @IsInt()
    targetId!: number;
    @IsOptional()
    @IsInt()
    postId?:number;
    @IsOptional()
    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsString()
    targetTitle?:string;
    @Transform(({value}) => typeof value === 'string' ? value.trim(): value)
    @IsString()
    @IsNotEmpty()
    reason!:string;
}
