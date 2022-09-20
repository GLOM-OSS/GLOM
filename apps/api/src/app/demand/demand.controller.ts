import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { DemandPostData } from './dto';
import { DemandService } from './demand.service';

@Controller('demands')
export class DemandController {
  constructor(private demandService: DemandService) {}

  @Get('')
  @UseGuards(AuthenticatedGuard)
  async getAllDemands() {
    return this.demandService.getDemands();
  }

  @Post('new')
  async addNewDemand(@Body() schoolDemand: DemandPostData) {
    await this.demandService.addSchoolDemand(schoolDemand);
  }

}
