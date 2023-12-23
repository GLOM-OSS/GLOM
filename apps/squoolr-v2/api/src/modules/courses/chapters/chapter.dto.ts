import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Chapter } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @ApiProperty()
  chapter_title: string;

  @IsString()
  @ApiProperty()
  chapter_objective: string;

  @IsString()
  @ApiProperty()
  annual_subject_id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  parent_chapter_id: string | null;

  constructor(props: CreateChapterDto) {
    Object.assign(this, props);
  }
}

export class UpdateChapterDto extends PickType(PartialType(CreateChapterDto), [
  'chapter_title',
  'chapter_objective',
]) {}

export class ChapterEntity extends CreateChapterDto implements Chapter {
  @ApiProperty()
  chapter_id: string;

  @ApiProperty()
  chapter_position: number;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: ChapterEntity) {
    super(props);
    Object.assign(this, props);
  }
}
