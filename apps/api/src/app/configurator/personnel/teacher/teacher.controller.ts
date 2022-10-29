import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { DeserializeSessionData, Role } from "../../../../utils/types";
import { Roles } from "../../../app.decorator";
import { AuthenticatedGuard } from "../../../auth/auth.guard";
import { TeacherPostDto, TeacherPutDto } from "../../configurator.dto";
import { Request } from 'express';
import { TeacherService } from "./teacher.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags('Personnel/teachers')
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class TeacherController {
    constructor(private teacherService: TeacherService) {}

    @Post('/new')
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
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
}