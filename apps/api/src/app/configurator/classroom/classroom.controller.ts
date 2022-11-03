import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Request } from 'express';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  ClassroomDivisionQueryDto,
  ClassroomPutDto,
  ClassroomQueryDto,
} from '../configurator.dto';
import { ClassroomService } from './classroom.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Classrooms')
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class ClassroomController {
  constructor(private classroomService: ClassroomService) {}

  @Get('all')
  async getAllClassrooms(
    @Req() request: Request,
    @Query() classQuery: ClassroomQueryDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return {
      classrooms: await this.classroomService.findAll({
        academic_year_id,
        ...classQuery,
      }),
    };
  }

  @Get('/divisions')
  async getAllClassroomDvisions(
    @Query() { annual_classroom_id }: ClassroomDivisionQueryDto
  ) {
    return {
      classroomDivisions: await this.classroomService.findDivisions(
        annual_classroom_id
      ),
    };
  }

  @Put(':classroom_code/edit')
  async editClassroom(
    @Req() request: Request,
    @Param('classroom_code') classroom_code: string,
    @Body() classroomData: ClassroomPutDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    return {
      classroom: await this.classroomService.editClassroom(
        classroom_code,
        classroomData,
        academic_year_id,
        annual_configurator_id
      ),
    };
  }
}
