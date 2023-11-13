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
  UpdateSchoolStatus,
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
  @Get([':school_id', ':demand_code'])
  @ApiOkResponse({ type: SchoolEntity })
  getDemandStatus(@Param('school_id') identifier: string) {
    return this.demandService.findOne(identifier);
  }

  @Get(':school_id/details')
  @ApiOkResponse({ type: DemandDetails })
  getDemandDetails(@Param('school_id') schoolId: string) {
    return this.demandService.findDetails(schoolId);
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
  @Put(':school_id/validate')
  validateDemand(
    @Req() request: Request,
    @Param('school_id') schoolId: string,
    @Body() validatedDemand: ValidateDemandDto
  ) {
    const userId = request.user.login_id;
    const { rejection_reason, subdomain } = validatedDemand;
    if ((rejection_reason && subdomain) || (!rejection_reason && !subdomain))
      throw new BadRequestException(
        'rejection_reason and subdomain cannot coexist'
      );
    return this.demandService.validateDemand(schoolId, validatedDemand, userId);
  }

  @Put(':school_id/status')
  @ApiOkResponse()
  @UseGuards(AuthenticatedGuard)
  updateSchoolStatus(
    @Req() request: Request,
    @Param('school_id') schoolId: string,
    @Body() payload: UpdateSchoolStatus
  ) {
    const userId = request.user.login_id;
    return this.demandService.updateStatus(schoolId, payload, userId);
  }
}
