import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Resource, ResourceType } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ResourceEntity implements Resource {
  @ApiProperty()
  resource_id: string;

  @ApiProperty({ enum: ResourceType })
  resource_type: ResourceType;

  @ApiProperty()
  resource_ref: string;

  @ApiProperty()
  resource_name: string;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  chapter_id: string;

  @ApiProperty()
  annual_subject_id: string;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: ResourceEntity) {
    Object.assign(this, props);
  }
}
