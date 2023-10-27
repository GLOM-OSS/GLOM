import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role, Roles } from '../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto';
import { DepartmentsService } from './departments.service';
import { QueryParamsDto } from '../modules.dto';

@ApiTags('Departments')
@Controller('departments')
@UseGuards(AuthenticatedGuard)
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get('all')
  async getDepartments(
    @Req() request: Request,
    @Query() params: QueryParamsDto
  ) {
    const { school_id } = request.user;
    return this.departmentsService.findAll(school_id, params);
  }

  @Post('new')
  @Roles(Role.CONFIGURATOR)
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

  @Put(':department_id/edit')
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
}
