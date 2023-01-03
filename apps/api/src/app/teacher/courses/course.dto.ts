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

export class LinkPostDto {
  @IsString()
  @ApiProperty({ required: false })
  resource_ref: string;

  @IsString()
  @ApiProperty({ required: false })
  resource_name: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  chapter_id?: string;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;
}
