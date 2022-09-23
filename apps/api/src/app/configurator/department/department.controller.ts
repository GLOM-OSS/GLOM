import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { DepartmentService } from './department.service';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { DepartmentPostDto, DepartmentQueryDto } from '../configurator.dto';

@Roles(Role.CONFIGURATOR)
@Controller('departments')
@UseGuards(AuthenticatedGuard)
export class DepartmentController {
  constructor(private configuratorService: DepartmentService) {}

  @Get('all')
  async getAllDepartment(
    @Req() request: Request,
    @Query() { archived }: DepartmentQueryDto
  ) {
    const { school_id } = request.user as DeserializeSessionData;
    return {
      departments: await this.configuratorService.findAllDepartments(
        school_id,
        { archived }
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
      department: await this.configuratorService.addNewDepartment(
        school_id,
        newDepartment,
        annual_configurator_id
      ),
    };
  }
}
