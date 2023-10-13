import { ApiProperty } from '@nestjs/swagger';
import { InquiryType, Inquiry } from '@prisma/client';

export class CreateInquiryDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
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
