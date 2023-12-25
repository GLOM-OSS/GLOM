import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Resource, ResourceType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

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

export class UpdateResourceDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  resource_name?: string;

  @Exclude()
  @ApiHideProperty()
  is_deleted?: boolean;
}
