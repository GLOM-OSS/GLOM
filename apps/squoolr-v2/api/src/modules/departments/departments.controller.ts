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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role, Roles } from '../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { QueryParamsDto } from '../modules.dto';
import {
  CreateDepartmentDto,
  DepartmentEntity,
  UpdateDepartmentDto,
} from './department.dto';
import { DepartmentsService } from './departments.service';

@ApiTags('Departments')
@Controller('departments')
@UseGuards(AuthenticatedGuard)
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get('all')
  @ApiOkResponse({ type: [DepartmentEntity] })
  async getDepartments(
    @Req() request: Request,
    @Query() params: QueryParamsDto
  ) {
    const { school_id } = request.user;
    return this.departmentsService.findAll(school_id, params);
  }

  @Post('new')
  @Roles(Role.CONFIGURATOR)
  @ApiCreatedResponse({ type: DepartmentEntity })
  async createDepartment(
    @Req() request: Request,
    @Body() newDepartment: CreateDepartmentDto
  ) {
    const {
      school_id,
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.departmentsService.create(
      { school_id, ...newDepartment },
      annual_configurator_id
    );
  }

  @Put(':department_id')
  @Roles(Role.CONFIGURATOR)
  async updateDepartment(
    @Req() request: Request,
    @Param('department_id') department_id: string,
    @Body() updatePayload: UpdateDepartmentDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.departmentsService.update(
      department_id,
      updatePayload,
      annual_configurator_id
    );
  }

  @Delete(':department_id')
  @Roles(Role.CONFIGURATOR)
  async deleteDepartment(
    @Req() request: Request,
    @Param('department_id') department_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.departmentsService.update(
      department_id,
      { is_deleted: true },
      annual_configurator_id
    );
  }
}
