import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../auth/auth.d';
import { IsPublic, Role, Roles } from '../auth/auth.decorator';
import {
  QueryDemandStatusDto,
  SubmitDemandDto,
  ValidateDemandDto,
} from './demand.dto';
import { DemandService } from './demand.service';

@ApiTags('Demands')
@Roles(Role.ADMIN)
@Controller('demands')
export class DemandController {
  constructor(private demandService: DemandService) {}

  @Get('all')
  async getAllDemands() {
    return { school_demands: await this.demandService.findAll() };
  }

  @Get(':school_code/details')
  async getDemandDetails(@Param('school_code') school_code: string) {
    return {
      school_demand: await this.demandService.findOne(school_code),
    };
  }

  @Post('new')
  @IsPublic()
  async submitDemand(@Body() schoolDemandPayload: SubmitDemandDto) {
    return {
      school_demand_code: await this.demandService.create(schoolDemandPayload),
    };
  }

  @Put('validate')
  async validateDemand(
    @Req() request: Request,
    @Body() validatedDemand: ValidateDemandDto
  ) {
    const { rejection_reason, subdomain } = validatedDemand;
    if ((rejection_reason && subdomain) || (!rejection_reason && !subdomain))
      throw new BadRequestException(
        'rejection_reason and subdomain cannot coexist'
      );
    await this.demandService.validateDemand(
      validatedDemand,
      request.user['login_id']
    );
  }

  @Get('status')
  @IsPublic()
  @ApiOperation({ summary: 'Check your school demand status' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getDemandStatus(@Query() { school_demand_code }: QueryDemandStatusDto) {
    return {
      demand_status: await this.demandService.getStatus(school_demand_code),
    };
  }

  @Put(':school_code/status')
  // @UseGuards(AuthenticatedGuard)
  async updateDemandStatus(
    @Req() request: Request,
    @Param('school_code') school_code: string
  ) {
    const { login_id } = request.user as User;
    await this.demandService.updateStatus(school_code, login_id);
  }
}
