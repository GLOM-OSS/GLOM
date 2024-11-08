import { ApiProperty, PartialType } from '@nestjs/swagger';
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

export class ChapterPutDto extends PartialType(ChapterPostDto) {}

export class ResourceOwner {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  chapter_id?: string;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;
}

export class LinkPostDto extends ResourceOwner {
  @IsString()
  @ApiProperty({ required: false })
  resource_ref: string;

  @IsString()
  @ApiProperty({ required: false })
  resource_name: string;
}

export class CourseQueryDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: true })
  semester_number?: number;
}
