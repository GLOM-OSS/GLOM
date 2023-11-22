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
  getAllDemands() {
    return this.schoolsService.findAll();
  }

  @IsPublic()
  @Get([':school_id', ':school_code'])
  @ApiOkResponse({ type: SchoolEntity })
  getDemandStatus(@Param('school_id') identifier: string) {
    return this.schoolsService.findOne(identifier);
  }

  @Get(':school_id/details')
  @ApiOkResponse({ type: SchoolDemandDetails })
  getDemandDetails(@Param('school_id') schoolId: string) {
    return this.schoolsService.findDetails(schoolId);
  }

  @IsPublic()
  @Post('new')
  @ApiCreatedResponse({ type: SchoolEntity })
  submitDemand(@Body() schoolDemandPayload: SubmitSchoolDemandDto) {
    const {
      payment_id,
      school: { referral_code },
    } = schoolDemandPayload;
    if (payment_id && referral_code)
      throw new BadRequestException(
        'payment number and referral code cannot be both provided'
      );
    if (!payment_id && !referral_code)
      throw new BadRequestException(
        'please provide payment number or referral code'
      );
    return this.schoolsService.create(schoolDemandPayload);
  }

  @ApiNoContentResponse()
  @Put(':school_id/validate')
  validateDemand(
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
    return this.schoolsService.validateDemand(
      schoolId,
      validatedDemand,
      userId
    );
  }

  @Put(':school_id/status')
  @ApiOkResponse()
  @UseGuards(AuthenticatedGuard)
  updateSchoolStatus(
    @Req() request: Request,
    @Param('school_id') schoolId: string,
    @Body() payload: UpdateSchoolDemandStatus
  ) {
    const userId = request.user.login_id;
    return this.schoolsService.updateStatus(schoolId, payload, userId);
  }
}
