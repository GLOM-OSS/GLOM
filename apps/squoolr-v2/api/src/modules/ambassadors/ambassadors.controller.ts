import { Controller, Get, Param } from '@nestjs/common';
import { AmbassadorsService } from './ambassadors.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AmbassadorEntity } from './ambassadors.dto';

@ApiTags('Ambassadors')
@Controller('ambassadors')
export class AmbassadorsController {
  constructor(private ambassadorsService: AmbassadorsService) {}

  @Get('all')
  @ApiOkResponse({ type: [AmbassadorEntity] })
  async getAmbassadors() {
    return this.ambassadorsService.findAll();
  }

  @Get([':ambassador_id', ':referral_code/verify'])
  @ApiOkResponse({ type: AmbassadorEntity })
  async getAmbassador(
    @Param('ambassador_id') ambassadorId: string,
    @Param('referral_code') referralCode: string
  ) {
    if (ambassadorId) return this.ambassadorsService.findOne(ambassadorId);
    else return this.ambassadorsService.verify(referralCode);
  }
}
