import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class WeightingPutDto {
  @IsUUID()
  @ApiProperty()
  cycle_id: string;

  @IsNumber()
  @ApiProperty()
  weighting_system: number;
}
