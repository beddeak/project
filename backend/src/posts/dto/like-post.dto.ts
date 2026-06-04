import { IsInt, Min } from "class-validator";

export class ToggleLikeDto {
    @IsInt()
    @Min(1)
    userId!: number
}