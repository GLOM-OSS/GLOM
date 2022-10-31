import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Request } from 'express';
import { ERR01, ERR02 } from '../../errors';
import { DeserializeSessionData } from '../../utils/types';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { DemandService } from './demand.service';
import {
  DemandPostDto, DemandQueryDto,
  DemandStatusQueryDto,
  DemandValidateDto
} from './dto';

@ApiBearerAuth()
@ApiTags('demands')
@Controller('demands')
export class DemandController {
  constructor(private demandService: DemandService) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async getDemandInfo(@Query() query: DemandQueryDto) {
    const { school_code } = query;
    return {
      school_demand: await this.demandService.findOne(school_code),
    };
  }

  @Get('all')
  @UseGuards(AuthenticatedGuard)
  async getAllDemands() {
    return { school_demands: await this.demandService.findAll() };
  }

  @Post('new')
  async addNewDemand(@Body() schoolDemand: DemandPostDto) {
    return {
      school_demand_code: await this.demandService.addDemand(schoolDemand),
    };
  }

  @Put('validate')
  @UseGuards(AuthenticatedGuard)
  async validateDemand(
    @Req() request: Request,
    @Body() validatedDemand: DemandValidateDto
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
      return;
    } catch (error) {
      throw new HttpException(
        ERR02[preferred_lang],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Check your school demand status' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getDemandStatus(@Query() { school_demand_code }: DemandStatusQueryDto) {
    return {
      demand_status: await this.demandService.getStatus(school_demand_code),
    };
  }

  @Put(':school_code/status')
  @UseGuards(AuthenticatedGuard)
  async editDemandStatus(
    @Req() request: Request,
    @Param('school_code') school_code: string
  ) {
    const { preferred_lang, login_id } = request.user as DeserializeSessionData;
    try {
      await this.demandService.editDemandStatus(school_code, login_id);
      return;
    } catch (error) {
      throw new HttpException(
        ERR02[preferred_lang],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
