import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Inquiry, InquiryType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

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

  @IsEnum(InquiryType)
  @ApiProperty({ enum: InquiryType })
  type: InquiryType;

  constructor(props: CreateInquiryDto) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class InquiryEntity extends CreateInquiryDto implements Inquiry {
  @ApiProperty()
  inquiry_id: string;

  @ApiProperty()
  created_at: Date;

  constructor(props: InquiryEntity) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}
