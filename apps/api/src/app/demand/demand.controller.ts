import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { DemandPostData, ValidateDemandDto } from './dto';
import { DemandService } from './demand.service';
import { CodeGeneratorService } from '../../utils/code-generator';
import { Request } from 'express';
import { DeserializeSessionData } from '../../utils/types';
import { ERR01, ERR02 } from '../../errors';

@Controller('demands')
export class DemandController {
  constructor(
    private demandService: DemandService,
    private generator: CodeGeneratorService
  ) {}

  @Get('')
  @UseGuards(AuthenticatedGuard)
  async getAllDemands() {
    return this.demandService.getDemands();
  }

  @Post('new')
  async addNewDemand(@Body() schoolDemand: DemandPostData) {
    await this.demandService.addSchoolDemand(schoolDemand);
  }

  @Put('validate')
  @UseGuards(AuthenticatedGuard)
  async validateDemand(
    @Req() request: Request,
    @Body() validatedDemand: ValidateDemandDto
  ) {
    const { preferred_lang } = request.user as DeserializeSessionData;
    const { rejection_reason, subdomain } = validatedDemand;
    if ((rejection_reason && subdomain) || (!rejection_reason && !subdomain))
      throw new HttpException(ERR01[preferred_lang], HttpStatus.BAD_REQUEST);
    try {
      await this.demandService.validateDemand(
        validatedDemand,
        request.user['login_id']
      );
    } catch (error) {
      throw new HttpException(ERR02[preferred_lang], HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
