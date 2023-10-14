import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { PlatformSettingsEntity } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/platform-settings')
  @ApiOkResponse({ type: PlatformSettingsEntity })
  getPlatformSettings() {
    return this.appService.getPlatformSettings();
  }
}
