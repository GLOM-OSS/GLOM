import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import {
  AnnualClassroomEntity,
  QueryClassroomDto,
  UpdateClassroomDto,
} from './classroom.dto';
import { ClassroomsService } from './classrooms.service';
import { Role, Roles } from '../../app/auth/auth.decorator';
import { Request } from 'express';

@ApiTags('Classrooms')
@Controller('classrooms')
@UseGuards(AuthenticatedGuard)
export class ClassroomsController {
  constructor(private classroomsService: ClassroomsService) {}

  @Get('all')
  @ApiOkResponse({ type: [AnnualClassroomEntity] })
  async getClassrooms(
    @Query() { annual_major_id, ...params }: QueryClassroomDto
  ) {
    return this.classroomsService.findAll(annual_major_id, {
      annual_major_id,
      ...params,
    });
  }

  @Put(':annual_classroom_id')
  @Roles(Role.CONFIGURATOR)
  async updateClassroom(
    @Req() request: Request,
    @Param('annual_classroom_id') annual_classroom_id: string,
    @Body() updatePayload: UpdateClassroomDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.classroomsService.update(
      annual_classroom_id,
      updatePayload,
      annual_configurator_id
    );
  }

  @Delete(':annual_classroom_id')
  @Roles(Role.CONFIGURATOR)
  async deleteClassroom(
    @Req() request: Request,
    @Param('annual_classroom_id') annual_classroom_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.classroomsService.update(
      annual_classroom_id,
      { is_deleted: true },
      annual_configurator_id
    );
  }
}