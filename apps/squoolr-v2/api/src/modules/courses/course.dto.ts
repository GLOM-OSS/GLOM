import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { QueryParamsDto } from '../modules.dto';
import { Type } from 'class-transformer';

export class QueryCourseDto extends QueryParamsDto {
  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  semesters?: number[];

  @IsString()
  @ApiProperty()
  annual_classroom_id: string;
}
