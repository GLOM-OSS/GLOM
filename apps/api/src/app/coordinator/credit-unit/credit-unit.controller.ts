import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { CreditUnitQuery } from '../coordinator.dto';
import { CreditUnitService } from './credit-unit.service';

@Controller()
@ApiTags('UEs')
@Roles(Role.COORDINATOR)
@UseGuards(AuthenticatedGuard)
export class CreditUnitController {
  constructor(private creditUnitService: CreditUnitService) {}

  @Get('majors')
  async getCoordinatorMajors(@Req() request: Request) {
    const {
      annualTeacher: { classroomDivisions },
    } = request.user as DeserializeSessionData;
    return await this.creditUnitService.getCoordinatorMajors(
      classroomDivisions
    );
  }

  @Get('all')
  async getCrediUnits(
    @Req() request: Request,
    @Query() query: CreditUnitQuery
  ) {
    const {
      annualTeacher: { classroomDivisions },
    } = request.user as DeserializeSessionData;
    const majors = await this.creditUnitService.getCoordinatorMajors(
      classroomDivisions
    );
    return await this.creditUnitService.getCreditUnits(
      majors.map(({ major_id }) => ({ major_id })),
      query
    );
  }
}
