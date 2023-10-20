import { Controller, Get } from '@nestjs/common';
import { AmbassadorsService } from './ambassadors.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AmbassadorEntity } from './ambassadors.dto';

@Controller('ambassadors')
export class AmbassadorsController {
  constructor(private ambassadorsService: AmbassadorsService) {}

  @Get('all')
  @ApiOkResponse({ type: [AmbassadorEntity] })
  async getAmbassadors() {
    return this.ambassadorsService.findAll();
  }
}
