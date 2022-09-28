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
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { DepartmentService } from './department.service';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import {
  DepartmentPostDto,
  DepartmentPutDto,
  DepartmentQueryDto,
} from '../configurator.dto';

@Roles(Role.CONFIGURATOR)
@Controller('departments')
@UseGuards(AuthenticatedGuard)
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get('all')
  async getAllDepartment(
    @Req() request: Request,
    @Query() query: DepartmentQueryDto
  ) {
    const { school_id } = request.user as DeserializeSessionData;
    return {
      departments: await this.departmentService.findAllDepartments(
        school_id,
        query
      ),
    };
  }

  @Post('new')
  async addNewDepartment(
    @Req() request: Request,
    @Body() newDepartment: DepartmentPostDto
  ) {
    const {
      school_id,
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    return {
      department: await this.departmentService.addNewDepartment(
        school_id,
        newDepartment,
        annual_configurator_id
      ),
    };
  }

  @Put(':department_code/edit')
  async editDepartmentName(
    @Req() request: Request,
    @Param('department_code') department_code: string,
    @Body() data: DepartmentPutDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    try {
      return {
        department: await this.departmentService.editDepartment(
          department_code,
          data,
          annual_configurator_id
        ),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
