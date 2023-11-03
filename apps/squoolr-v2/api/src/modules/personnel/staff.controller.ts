import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { QueryOneStaffDto, QueryStaffDto, StaffEntity } from './staff.dto';
import { StaffService } from './staff.service';
import { StaffRole } from '../../utils/enums';

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
}
