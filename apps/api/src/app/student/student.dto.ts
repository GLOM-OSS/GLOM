import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class StudentQueryQto {
    @IsUUID()
    @IsOptional()
    @ApiProperty()
    major_code?: string;
  
    @IsUUID()
    @IsOptional()
    @ApiProperty()
    classroom_code?: string;
  }