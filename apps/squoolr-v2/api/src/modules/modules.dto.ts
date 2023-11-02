import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Cycle, CycleName, CycleType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { QueryParams } from './module';

export class QueryParamsDto implements QueryParams {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_deleted?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  keywords?: string;
}

export class CycleEntity implements Cycle {
  @ApiProperty()
  cycle_id: string;

  @ApiProperty({ enum: CycleName })
  cycle_name: CycleName;

  @ApiProperty({ enum: CycleType })
  cycle_type: CycleType;

  @ApiProperty()
  number_of_years: number;

  @Exclude()
  @ApiProperty()
  created_at: Date;

  constructor(props: Partial<CycleEntity>) {
    Object.assign(this, props);
  }
}
