import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AcademicYearQueryDto {
  @ApiProperty()
  @IsString()
  academic_year_id: string;
}

export class PersonnelTemplate {
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

export class AcademicYearPostDto {
  @ApiProperty()
  @IsDateString()
  starts_at: Date;

  @ApiProperty()
  @IsDateString()
  ends_at: Date;
}

export class TemplateYearPostDto extends AcademicYearPostDto {
  @Type(() => PersonnelTemplate)
  @ValidateNested({ each: true })
  @ApiProperty({ type: PersonnelTemplate })
  personnelConfig: PersonnelTemplate;

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
