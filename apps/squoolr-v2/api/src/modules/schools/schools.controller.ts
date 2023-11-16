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
  SchoolDemandDetails,
  SchoolEntity,
  SubmitSchoolDemandDto,
  UpdateSchoolDemandStatus,
  UpdateSchoolDto,
  ValidateSchoolDemandDto,
} from './schools.dto';
import { SchoolsService } from './schools.service';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';

@ApiTags('Schools')
@Roles(Role.ADMIN)
@Controller('schools')
@UseGuards(AuthenticatedGuard)
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Get()
  @ApiOkResponse({ type: [SchoolEntity] })
  getSchools() {
    return this.schoolsService.findAll();
  }

  @IsPublic()
  @Get([':school_id', ':school_code'])
  @ApiOkResponse({ type: SchoolEntity })
  getSchool(@Param('school_id') identifier: string) {
    return this.schoolsService.findOne(identifier);
  }

  @Get(':school_id/details')
  @ApiOkResponse({ type: SchoolDemandDetails })
  getSchoolDetails(@Param('school_id') schoolId: string) {
    return this.schoolsService.findDetails(schoolId);
  }

  @IsPublic()
  @Post('new')
  @ApiCreatedResponse({ type: SchoolEntity })
  submitSchoolDemand(@Body() schoolDemandPayload: SubmitSchoolDemandDto) {
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
    return this.schoolsService.create(schoolDemandPayload);
  }

  @ApiNoContentResponse()
  @Put(':school_id/validate')
  validateSchoolDemand(
    @Req() request: Request,
    @Param('school_id') schoolId: string,
    @Body() validatedDemand: ValidateSchoolDemandDto
  ) {
    const userId = request.user.login_id;
    const { rejection_reason, subdomain } = validatedDemand;
    if ((rejection_reason && subdomain) || (!rejection_reason && !subdomain))
      throw new BadRequestException(
        'rejection_reason and subdomain cannot coexist'
      );
    return this.schoolsService.validate(
      schoolId,
      validatedDemand,
      userId
    );
  }

  @Put(':school_id')
  @ApiOkResponse()
  @Roles(Role.CONFIGURATOR)
  updateSchool(
    @Req() request: Request,
    @Param('school_id') schoolId: string,
    @Body() payload: UpdateSchoolDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.schoolsService.update(
      schoolId,
      payload,
      annual_configurator_id
    );
  }

  @Put(':school_id/status')
  @ApiOkResponse()
  updateSchoolStatus(
    @Req() request: Request,
    @Param('school_id') schoolId: string,
    @Body() payload: UpdateSchoolDemandStatus
  ) {
    const userId = request.user.login_id;
    return this.schoolsService.updateStatus(schoolId, payload, userId);
  }
}
