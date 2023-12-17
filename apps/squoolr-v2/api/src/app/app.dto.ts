import { ApiProperty } from '@nestjs/swagger';
import {
  PlatformSettings,
  SubjectPart,
  TeacherType,
  TeachingGrade,
} from '@prisma/client';
import { Exclude } from 'class-transformer';

export class PlatformSettingsEntity implements PlatformSettings {
  @ApiProperty()
  platform_settings_id: string;

  @ApiProperty()
  platform_fee: number;

  @ApiProperty()
  onboarding_fee: number;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  created_by: string;

  constructor(props: PlatformSettingsEntity) {
    Object.assign(this, props);
  }
}

export class TeacherTypeEntity implements TeacherType {
  @ApiProperty()
  teacher_type_id: string;

  @ApiProperty()
  teacher_type: string;

  @ApiProperty()
  created_at: Date;

  constructor(props: TeacherTypeEntity) {
    Object.assign(this, props);
  }
}

export class TeachingGradeEntity implements TeachingGrade {
  @ApiProperty()
  teaching_grade_id: string;

  @ApiProperty()
  teaching_grade: string;

  @ApiProperty()
  created_at: Date;

  constructor(props: TeachingGradeEntity) {
    Object.assign(this, props);
  }
}

export class SubjectPartEntity implements SubjectPart {
  @ApiProperty()
  subject_part_id: string;

  @ApiProperty()
  subject_part_name: string;

  @ApiProperty()
  created_at: Date;

  constructor(props: SubjectPartEntity) {
    Object.assign(this, props);
  }
}
