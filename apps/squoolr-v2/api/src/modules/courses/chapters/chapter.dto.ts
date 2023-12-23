import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Chapter } from '@prisma/client';
import { Exclude } from 'class-transformer';


export class ChapterEntity implements Chapter {
  @ApiProperty()
  chapter_id: string;

  @ApiProperty()
  chapter_title: string;

  @ApiProperty()
  chapter_objective: string;

  @ApiProperty()
  chapter_position: number;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  annual_subject_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  chapter_parent_id: string;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: ChapterEntity) {
    Object.assign(this, props);
  }
}
