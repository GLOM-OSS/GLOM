import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../app/auth/auth.decorator';
import { Role, StaffRole } from '../../utils/enums';
import { BatchPayloadDto } from '../modules.dto';
import {
  CreateStaffDto,
  AnnualStaffIDsDto,
  QueryOneStaffDto,
  QueryStaffDto,
  StaffEntity,
  StaffRoleDto,
  UpdateStaffDto,
} from './staff.dto';
import { StaffService } from './staff.service';

@ApiTags('Staffs')
@Controller('staffs')
// @UseGuards(AuthenticatedGuard)
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get()
  @ApiOkResponse({ type: [StaffEntity] })
  async getAllStaff(
    @Req() request: Request,
    @Query() { roles, ...params }: QueryStaffDto
  ) {
    const { activeYear } = request.user;
    return this.staffService.findAll(roles ?? 'ALL', {
      academic_year_id: activeYear?.academic_year_id,
      params,
    });
  }

  @Get(':annual_staff_id')
  @ApiOkResponse({ type: StaffEntity })
  async getStaff(
    @Param('annual_staff_id') annualStaffId: string,
    @Query() { role }: QueryOneStaffDto
  ) {
    return this.staffService.findOne(role, annualStaffId);
  }

  @Post('new')
  @Roles(Role.CONFIGURATOR)
  @ApiCreatedResponse({ type: StaffEntity })
  async createStaff(@Req() request: Request, @Body() newStaff: CreateStaffDto) {
    const {
      school_id,
      activeYear: { academic_year_id },
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.staffService.create(
      newStaff.payload,
      { school_id, academic_year_id },
      annual_configurator_id
    );
  }

  @Put([
    ':annual_teacher_id',
    ':annual_coordinator_id',
    ':annual_configurator_id',
    ':annual_registry_id',
  ])
  @Roles(Role.CONFIGURATOR)
  @ApiNoContentResponse()
  async updateStaff(
    @Req() request: Request,
    @Param('annual_teacher_id') annualTeacherId: string,
    @Body() newStaff: UpdateStaffDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.staffService.update(
      annualTeacherId,
      newStaff.payload,
      annual_configurator_id
    );
  }

  @Delete([
    ':annual_teacher_id',
    ':annual_coordinator_id',
    ':annual_configurator_id',
    ':annual_registry_id',
  ])
  @Roles(Role.CONFIGURATOR)
  @ApiNoContentResponse()
  async disableStaff(
    @Req() request: Request,
    @Param('annual_teacher_id') annualTeacherId: string,
    @Body() payload: StaffRoleDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.staffService.disable(
      annualTeacherId,
      payload,
      annual_configurator_id
    );
  }

  @Delete()
  @Roles(Role.CONFIGURATOR)
  @ApiOkResponse({ type: BatchPayloadDto })
  async disableManyStaff(
    @Req() request: Request,
    @Query() disabledStaff: AnnualStaffIDsDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.staffService.disableMany(disabledStaff, annual_configurator_id);
  }

  @Patch()
  @Roles(Role.ADMIN, Role.CONFIGURATOR)
  @ApiOkResponse({ type: BatchPayloadDto })
  async resetStaffPasswords(
    @Req() request: Request,
    @Query() disabledStaff: AnnualStaffIDsDto
  ) {
    const { login_id, annualConfigurator } = request.user;
    return this.staffService.resetPasswords(
      disabledStaff,
      annualConfigurator?.annual_configurator_id ?? login_id,
      !!annualConfigurator
    );
  }
}
