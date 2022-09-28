import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  isArray, IsBoolean, IsNumber,
  IsOptional,
  IsString,
  IsUUID, registerDecorator,
  registerSchema, ValidateNested,
  validateSync,
  ValidationOptions,
  ValidationSchema
} from 'class-validator';

export class DepartmentPostDto {
  @IsString()
  @ApiProperty()
  department_name: string;

  @IsString()
  @ApiProperty()
  department_acronym: string;
}
export class DepartmentPutDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class DepartmentQueryDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  archived?: boolean;
}

export class ClassroomPost {
  @IsNumber()
  @ApiProperty()
  level: number;

  @IsNumber()
  @ApiProperty()
  total_fees_due: number;

  @IsNumber()
  @ApiProperty()
  registration_fee: number;
}
export class MajorPostDto {
  @IsString()
  @ApiProperty()
  major_name: string;

  @IsString()
  @ApiProperty()
  major_acronym: string;

  @IsString()
  @ApiProperty()
  department_code: string;

  @IsUUID()
  @ApiProperty()
  cycle_id: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ClassroomPost)
  classrooms: ClassroomPost[];
}

export class AnnualMajorPutDto {
  @IsString()
  @ApiProperty()
  major_name?: string;

  @IsString()
  @ApiProperty()
  major_acronym?: string;

  @IsString()
  @ApiProperty()
  department_code?: string;
}

export class MajorQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  academic_year_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  archived?: boolean;
}

export function IsValidArray(
  schema: ValidationSchema,
  validationOptions?: ValidationOptions
) {
  registerSchema(schema);
  return (array, propertyName: string) => {
    registerDecorator({
      name: 'IsValidArray',
      target: array.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value) {
          return (
            typeof isArray(value) &&
            value.length > 0 &&
            value.reduce(
              (prev, curValue) =>
                prev && validateSync(schema.name, curValue).length === 0,
              true
            )
          );
        },
      },
    });
  };
}
