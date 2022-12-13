import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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

export class CreditUnitPostDto {
  @ApiProperty()
  @IsUUID()
  major_id: string;

  @ApiProperty()
  @IsString()
  credit_unit_code: string;

  @ApiProperty()
  @IsString()
  credit_unit_name: string;

  @ApiProperty()
  @IsNumber()
  credit_points: number;

  @ApiProperty()
  @IsNumber()
  semester_number: number;
}

export class CreditUnitPutDto extends PartialType(CreditUnitPostDto) {}
