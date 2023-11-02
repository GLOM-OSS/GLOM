import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from '../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { QueryParamsDto } from '../modules.dto';
import { StaffService } from './staff.service';
import { QueryStaffDto, StaffEntity } from './staff.dto';

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
}
