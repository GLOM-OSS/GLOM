import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { IsPublic, Role, Roles } from '../auth/auth.decorator';
import {
  DemandDetails,
  SchoolEntity,
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
  @ApiOkResponse({ type: [SchoolEntity] })
  getAllDemands() {
    return this.demandService.findAll();
  }

  @IsPublic()
  @Get(':school_code')
  @ApiOkResponse({ type: SchoolEntity })
  getDemandStatus(@Param('school_code') schoolCode: string) {
    return this.demandService.findOne(schoolCode);
  }

  @Get(':school_code/details')
  @ApiOkResponse({ type: DemandDetails })
  getDemandDetails(@Param('school_code') schoolCode: string) {
    return this.demandService.findDetails(schoolCode);
  }

  @IsPublic()
  @Post('new')
  @ApiCreatedResponse({ type: SchoolEntity })
  submitDemand(@Body() schoolDemandPayload: SubmitDemandDto) {
    const {
      payment_phone,
      school: { referral_code },
    } = schoolDemandPayload;
    if (payment_phone && referral_code)
      throw new BadRequestException(
        'payment number and referral code cannot be both provided'
      );
    if (!payment_phone && !referral_code)
      throw new BadRequestException(
        'please provide phone number or referral code'
      );
    return this.demandService.create(schoolDemandPayload);
  }

  @Put('validate')
  @ApiOkResponse()
  validateDemand(
    @Req() request: Request,
    @Body() validatedDemand: ValidateDemandDto
  ) {
    const { rejection_reason, subdomain } = validatedDemand;
    if ((rejection_reason && subdomain) || (!rejection_reason && !subdomain))
      throw new BadRequestException(
        'rejection_reason and subdomain cannot coexist'
      );
    return this.demandService.validateDemand(
      validatedDemand,
      request.user['login_id']
    );
  }

  @Put(':school_code/status')
  @ApiOkResponse()
  // @UseGuards(AuthenticatedGuard)
  updateDemandStatus(
    @Req() request: Request,
    @Param('school_code') schoolCode: string
  ) {
    return this.demandService.updateStatus(
      schoolCode,
      request.user['login_id']
    );
  }
}
