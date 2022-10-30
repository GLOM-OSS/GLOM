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
import { DeserializeSessionData, Role } from '../../../../utils/types';
import { Roles } from '../../../app.decorator';
import { AuthenticatedGuard } from '../../../auth/auth.guard';
import {
  PersonnelQueryDto,
  TeacherPostDto,
  TeacherPutDto,
} from '../../configurator.dto';
import { Request } from 'express';
import { TeacherService } from './teacher.service';
import { ApiTags } from '@nestjs/swagger';
import { PersonnelService } from '../personnel.service';

@Controller()
@ApiTags('Personnel/teachers')
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class TeacherController {
  constructor(
    private teacherService: TeacherService,
    private personnelService: PersonnelService
  ) {}

  @Get('all')
  async findAllPersonnel(
    @Req() request: Request,
    @Query() query: PersonnelQueryDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;

    const teachers = await this.personnelService.findAll(
      Role.TEACHER,
      academic_year_id,
      query
    );
    return { teachers };
  }

  @Get(':annual_teacher_id')
  async findOne(@Param('annual_teacher_id') annual_teacher_id: string) {
    const teacher = await this.personnelService.findOne(
      Role.TEACHER,
      annual_teacher_id
    );
    return { teacher };
  }

  @Post('new')
  async addNewTeacher(
    @Req() request: Request,
    @Body() newTeacher: TeacherPostDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
      school_id,
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.teacherService.addNewTeacher(
        newTeacher,
        {
          school_id,
          academic_year_id,
        },
        annual_configurator_id
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':annual_teacher_id/edit')
  async editTeacher(
    @Req() request: Request,
    @Param('annual_teacher_id') annual_teacher_id: string,
    @Body() staffData: TeacherPutDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.teacherService.editTeacher(
        annual_teacher_id,
        staffData,
        annual_configurator_id
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':annual_teacher_id/reset-code')
  async resetStaffCode(
    @Req() request: Request,
    @Param('annual_teacher_id') annual_teacher_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.personnelService.resetPrivateCode(
        annual_teacher_id,
        Role.TEACHER,
        annual_configurator_id
      );

      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':annual_teacher_id/archive')
  async archivePersonnel(
    @Req() request: Request,
    @Param('annual_teacher_id') annual_teacher_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;

    try {
      await this.personnelService.archivePersonnel(
        annual_teacher_id,
        Role.TEACHER,
        annual_configurator_id
      );
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
