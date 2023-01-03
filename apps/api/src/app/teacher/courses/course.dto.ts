import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class ChapterPostDto {
  @IsString()
  @ApiProperty()
  chapter_title: string;

  @IsString()
  @ApiProperty()
  chapter_objective: string;

  @Min(1)
  @IsNumber()
  @ApiProperty()
  chapter_position: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  chapter_parent_id?: string;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;
}
