import { ApiProperty } from '@nestjs/swagger';
import { InquiryType, Inquiry } from '@prisma/client';

export class InquiryEntity implements Inquiry {
  @ApiProperty()
  inquiry_id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: InquiryType })
  type: InquiryType;

  @ApiProperty()
  created_at: Date;

  constructor(props: InquiryEntity) {
    Object.assign(this, props);
  }
}
