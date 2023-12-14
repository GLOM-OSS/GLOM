import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { Role } from '../../utils/enums';
import { BatchPayloadDto } from '../modules.dto';
import {
  CategorizedStaffIDs,
  CoordinatorEntity,
  CreateStaffDto,
  ManageStaffDto,
  QueryOneStaffDto,
  QueryStaffDto,
  StaffEntity,
  TeacherEntity,
  UpdateStaffDto,
  UpdateStaffRoleDto,
  UpdateStaffStatus,
} from './staff.dto';
import { StaffService } from './staff.service';

@ApiTags('Staffs')
@Controller('staffs')
@UseGuards(AuthenticatedGuard)
@ApiExtraModels(TeacherEntity, CoordinatorEntity)
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get()
  @ApiOkResponse({ type: [StaffEntity] })
  async getStaffs(
    @Req() request: Request,
    @Query() { roles, ...params }: QueryStaffDto
  ) {
    const { activeYear } = request.user;
    return this.staffService.findAll(roles ?? 'ALL', {
      academic_year_id: activeYear?.academic_year_id,
      params,
    });
  }

  @Get([
    ':annual_teacher_id',
    ':annual_coordinator_id',
    ':annual_configurator_id',
    ':annual_registry_id',
  ])
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(StaffEntity) },
        { $ref: getSchemaPath(TeacherEntity) },
        { $ref: getSchemaPath(CoordinatorEntity) },
      ],
    },
    description:
      '`StaffEntity`, `TeacherEntity` or `CoordinatorEntity` will ne returned depending on request query',
  })
  async getStaff(
    @Param('annual_teacher_id') annualStaffId: string,
    @Query() { role }: QueryOneStaffDto
  ) {
    return this.staffService.findOne(role, annualStaffId);
  }

  @Post('new')
  @Roles(Role.CONFIGURATOR)
  @ApiCreatedResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(StaffEntity) },
        { $ref: getSchemaPath(TeacherEntity) },
        { $ref: getSchemaPath(CoordinatorEntity) },
      ],
    },
    description:
      '`StaffEntity`, `TeacherEntity` or `CoordinatorEntity` will ne returned depending on request body',
  })
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

  @Put('private-codes')
  @Roles(Role.CONFIGURATOR)
  @ApiOkResponse({ type: BatchPayloadDto })
  async resetStaffPrivateCodes(
    @Req() request: Request,
    @Body() staffPayload: CategorizedStaffIDs
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.staffService.resetPrivateCodes(
      staffPayload,
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
    @Param('annual_teacher_id') annualStaffId: string,
    @Body() newStaff: UpdateStaffDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.staffService.update(
      annualStaffId,
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
  @Roles(Role.ADMIN, Role.CONFIGURATOR)
  @ApiNoContentResponse()
  async disableStaff(
    @Req() request: Request,
    @Param('annual_teacher_id') annualTeacherId: string,
    @Query() payload: UpdateStaffStatus
  ) {
    const { login_id, annualConfigurator } = request.user;
    return this.staffService.disable(
      annualTeacherId,
      payload,
      annualConfigurator?.annual_configurator_id || login_id,
      !annualConfigurator
    );
  }

  @Delete()
  @Roles(Role.ADMIN, Role.CONFIGURATOR)
  @ApiOkResponse({ type: BatchPayloadDto })
  async disableManyStaff(
    @Req() request: Request,
    @Query() { disable, ...disabledStaff }: ManageStaffDto
  ) {
    const { login_id, annualConfigurator } = request.user;
    return this.staffService.disableMany(
      disabledStaff,
      disable,
      annualConfigurator?.annual_configurator_id || login_id,
      !annualConfigurator
    );
  }

  @Post('reset-passwords')
  @Roles(Role.ADMIN, Role.CONFIGURATOR)
  @ApiOkResponse({ type: BatchPayloadDto })
  async resetStaffPasswords(
    @Req() request: Request,
    @Body() disabledStaff: CategorizedStaffIDs
  ) {
    const { login_id, annualConfigurator } = request.user;
    return this.staffService.resetPasswords(
      disabledStaff,
      annualConfigurator?.annual_configurator_id || login_id,
      !annualConfigurator
    );
  }

  @Put(':login_id/roles')
  @Roles(Role.CONFIGURATOR)
  @ApiOkResponse({ type: BatchPayloadDto })
  async updateStaffRoles(
    @Req() request: Request,
    @Param('login_id') loginId: string,
    @Body() staffPayload: UpdateStaffRoleDto
  ) {
    const {
      school_id,
      activeYear: { academic_year_id },
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.staffService.updateStaffRoles(
      loginId,
      { academic_year_id, school_id, ...staffPayload },
      annual_configurator_id
    );
  }
}
