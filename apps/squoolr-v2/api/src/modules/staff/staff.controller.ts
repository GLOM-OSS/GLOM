import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import {
  CreateStaffDto,
  QueryOneStaffDto,
  QueryStaffDto,
  StaffEntity,
} from './staff.dto';
import { StaffService } from './staff.service';
import { Role, StaffRole } from '../../utils/enums';
import { Roles } from '../../app/auth/auth.decorator';

@ApiTags('Staff')
@Controller('staff')
@UseGuards(AuthenticatedGuard)
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get('all')
  @ApiOkResponse({ type: [StaffEntity] })
  async getAllStaff(
    @Req() request: Request,
    @Query() { roles, ...params }: QueryStaffDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.staffService.findAll(roles ?? 'ALL', academic_year_id, params);
  }

  @Get('annual_staff_id')
  @ApiOkResponse({ type: StaffEntity })
  async getStaff(
    @Param('annual_staff_id') annualStaffId: string,
    @Query() { role }: QueryOneStaffDto
  ) {
    return this.staffService.findOne(role, annualStaffId);
  }

  @Post('new')
  @Roles(Role.CONFIGURATOR)
  @ApiOkResponse({ type: StaffEntity })
  async createStaff(@Req() request: Request, @Body() payload: CreateStaffDto) {
    const {
      school_id,
      activeYear: { academic_year_id },
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.staffService.create(
      { ...payload, school_id, academic_year_id },
      annual_configurator_id
    );
  }
}
