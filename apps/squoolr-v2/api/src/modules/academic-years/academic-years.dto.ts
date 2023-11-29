import { ApiProperty } from '@nestjs/swagger';
import { AcademicYear, AcademicYearStatus } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  ValidateNested,
} from 'class-validator';

export class TemplatePersonnelDto {
  @IsBoolean()
  @ApiProperty()
  reuse_configurators?: boolean;

  @IsBoolean()
  @ApiProperty()
  reuse_registries?: boolean;

  @IsBoolean()
  @ApiProperty()
  reuse_coordinators?: boolean;

  @IsBoolean()
  @ApiProperty()
  reuse_teachers?: boolean;
}

export class CreateAcademicYearDto {
  @ApiProperty()
  @IsDateString()
  starts_at: Date;

  @ApiProperty()
  @IsDateString()
  ends_at: Date;

  constructor(props: CreateAcademicYearDto) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class TemplateAcademicYearDto extends CreateAcademicYearDto {
  @Type(() => TemplatePersonnelDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: TemplatePersonnelDto })
  personnelConfig: TemplatePersonnelDto;

  @IsArray()
  @ApiProperty()
  classroomCodes: string[];

  @IsBoolean()
  @ApiProperty()
  reuse_coordinators_configs?: boolean;

  @IsBoolean()
  @ApiProperty()
  reuse_registries_configs?: boolean;
}

export class AcademicYearEntity
  extends CreateAcademicYearDto
  implements AcademicYear
{
  @ApiProperty()
  academic_year_id: string;

  @ApiProperty()
  year_code: string;

  @ApiProperty()
  started_at: Date | null;

  @ApiProperty()
  ended_at: Date | null;

  @ApiProperty({ enum: AcademicYearStatus })
  year_status: AcademicYearStatus;

  @ApiProperty()
  school_id: string;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  is_deleted: boolean;

  @Exclude()
  created_by: string;

  constructor(props: AcademicYearEntity) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}
