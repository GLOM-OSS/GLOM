import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IsPublic, Roles } from '../../app/auth/auth.decorator';
import { Role } from '../../utils/enums';
import {
  DemandDetails,
  SchoolEntity,
  SubmitDemandDto,
  ValidateDemandDto,
} from './demand.dto';
import { DemandService } from './demand.service';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';

@ApiTags('Demands')
@Roles(Role.ADMIN)
@Controller('demands')
@UseGuards(AuthenticatedGuard)
export class DemandController {
  constructor(private demandService: DemandService) {}

  @Get()
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
        'please provide payment number or referral code'
      );
    return this.demandService.create(schoolDemandPayload);
  }

  @ApiNoContentResponse()
  @Put(':school_code/validate')
  validateDemand(
    @Req() request: Request,
    @Param('school_code') schoolCode: string,
    @Body() validatedDemand: ValidateDemandDto
  ) {
    const { rejection_reason, subdomain } = validatedDemand;
    if ((rejection_reason && subdomain) || (!rejection_reason && !subdomain))
      throw new BadRequestException(
        'rejection_reason and subdomain cannot coexist'
      );
    return this.demandService.validateDemand(
      schoolCode,
      validatedDemand,
      request.user.login_id
    );
  }

  @ApiNoContentResponse()
  @Patch(':school_code/status')
  updateDemandStatus(
    @Req() request: Request,
    @Param('school_code') schoolCode: string
  ) {
    return this.demandService.updateStatus(schoolCode, request.user.login_id);
  }
}
