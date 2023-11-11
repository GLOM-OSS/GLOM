import { ApiProperty } from '@nestjs/swagger';
import { PlatformSettings } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class PlatformSettingsEntity implements PlatformSettings {
  @ApiProperty()
  platform_settings_id: string;

  @ApiProperty()
  platform_fee: number;

  @ApiProperty()
  onboarding_fee: number;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  created_by: string;

  constructor(props: PlatformSettingsEntity) {
    Object.assign(this, props);
  }
}
