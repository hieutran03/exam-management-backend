import { IsNumber, IsOptional } from "class-validator";

export class GetExamDto {
    @IsOptional()
    @IsNumber()
    course_id: number;
    @IsOptional()
    @IsNumber()
    teacher_id: number;
}