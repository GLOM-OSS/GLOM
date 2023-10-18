import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { PlatformSettingsEntity } from './app.dto';

@Injectable()
export class AppService {
  constructor(private prismaService: GlomPrismaService) {}

  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  async getPlatformSettings() {
    const platformSettings =
      await this.prismaService.platformSettings.findFirst();
    return new PlatformSettingsEntity(platformSettings);
  }
}
