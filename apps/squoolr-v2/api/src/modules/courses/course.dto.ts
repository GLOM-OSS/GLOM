import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { QueryParamsDto } from '../modules.dto';
import { Type } from 'class-transformer';

export class QueryCourseDto extends QueryParamsDto {
  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  semesters?: number[];
}
