import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InquiryType, Inquiry } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  phone: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name: string | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  message: string | null;

  @ApiProperty({ enum: InquiryType })
  type: InquiryType;

  constructor(props: CreateInquiryDto) {
    Object.assign(this, props);
  }
}

export class InquiryEntity extends CreateInquiryDto implements Inquiry {
  @ApiProperty()
  inquiry_id: string;

  @ApiProperty()
  created_at: Date;

  constructor(props: InquiryEntity) {
    super(props);
    Object.assign(this, props);
  }
}
