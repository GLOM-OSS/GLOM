import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { AnnualModule } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ModuleEntity implements AnnualModule {
  @ApiProperty()
  annual_module_id: string;

  @ApiProperty()
  module_code: string;

  @ApiProperty()
  module_name: string;

  @ApiProperty()
  credit_points: number;

  @ApiProperty()
  semester_number: number;

  @ApiProperty()
  is_exam_published: boolean;

  @ApiProperty()
  is_resit_published: boolean;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  annual_major_id: string;

  @Exclude()
  @ApiHideProperty()
  academic_year_id: string;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: ModuleEntity) {
    Object.assign(this, props);
  }
}
