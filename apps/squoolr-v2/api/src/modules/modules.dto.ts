import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Cycle, CycleName, Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { QueryParams } from './module';

export class QueryParamsDto implements QueryParams {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ default: false })
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

  @ApiProperty()
  number_of_years: number;

  @Exclude()
  @ApiProperty()
  created_at: Date;

  constructor(props: Partial<CycleEntity>) {
    Object.assign(this, props);
  }
}

export class BatchPayloadDto implements Prisma.BatchPayload {
  @ApiProperty()
  count: number;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional({
    description: 'describes the next action the client needs to perform',
  })
  next_action?: string;

  constructor(props: BatchPayloadDto) {
    Object.assign(this, props);
  }
}
