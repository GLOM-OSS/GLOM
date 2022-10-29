import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ERR01, ERR02 } from '../../errors';
import { DeserializeSessionData, Role } from '../../utils/types';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { DemandService } from './demand.service';
import {
  DemandPostData,
  DemandQueryDto,
  DemandStatusQueryDto,
  DemandValidateDto,
} from './demand.dto';
import { IsPublic, Roles } from '../app.decorator';

@ApiBearerAuth()
@ApiTags('Demands')
@Roles(Role.ADMIN)
@Controller('demands')
@UseGuards(AuthenticatedGuard)
export class DemandController {
  constructor(private demandService: DemandService) {}

  @Get()
  async getDemandInfo(@Query() query: DemandQueryDto) {
    const { school_demand_id } = query;
    return {
      school_demand: await this.demandService.findOne(school_demand_id),
    };
  }

  @Get('all')
  async getAllDemands() {
    return { school_demands: await this.demandService.findAll() };
  }

  @Post('new')
  @IsPublic()
  async addNewDemand(@Body() schoolDemand: DemandPostData) {
    return {
      school_demand_code: await this.demandService.addDemand(schoolDemand),
    };
  }

  @Put('validate')
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
    } catch (error) {
      throw new HttpException(
        ERR02[preferred_lang],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('status')
  @IsPublic()
  @ApiOperation({ summary: 'Check your school demand status' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getDemandStatus(@Query() { school_demand_code }: DemandStatusQueryDto) {
    return {
      demand_status: await this.demandService.getStatus(school_demand_code),
    };
  }
}
