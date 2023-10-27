import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_deleted?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  keywords?: string;
}
