import { ApiProperty } from '@nestjs/swagger';
import { Ambassador } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AmbassadorEntity implements Ambassador {
  @ApiProperty()
  ambassador_id: string;

  @ApiProperty()
  referral_code: string;

  @ApiProperty()
  login_id: string;

  @Exclude()
  created_at: Date;

  constructor(props: AmbassadorEntity) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}
