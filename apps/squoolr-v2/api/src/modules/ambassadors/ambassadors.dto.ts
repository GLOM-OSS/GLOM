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
    Object.assign(this, props);
  }
}
