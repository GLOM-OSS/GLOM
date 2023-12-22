import { ApiProperty } from '@nestjs/swagger';

export class CourseClassroom {
  @ApiProperty()
  classroom_acronym: string;

  constructor(props: CourseClassroom) {
    Object.assign(this, props);
  }
}

export class CourseEntity {
  @ApiProperty()
  annual_subject_id: string;

  @ApiProperty()
  subject_code: string;

  @ApiProperty()
  subject_name: string;

  @ApiProperty({ nullable: true })
  objective: string | null;

  @ApiProperty({ type: [CourseClassroom] })
  classrooms: CourseClassroom[];

  constructor(props: CourseEntity) {
    Object.assign(this, props);
  }
}
