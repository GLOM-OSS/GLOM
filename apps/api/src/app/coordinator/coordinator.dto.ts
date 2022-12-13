import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreditUnitQuery {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  major_id?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  semester_number?: number;
}

