import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Resource, ResourceType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @ApiProperty()
  annual_subject_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  chapter_id: string | null;

  constructor(props: CreateResourceDto) {
    Object.assign(this, props);
  }
}

export class ResourceEntity extends CreateResourceDto implements Resource {
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

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: ResourceEntity) {
    super(props);
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
