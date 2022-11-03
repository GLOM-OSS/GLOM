import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { AcademicYearPostDto, TemplateYearPostDto } from '../configurator.dto';
import { AcademicYearService } from './academic-year.service';

@Controller()
@Roles(Role.CONFIGURATOR)
@ApiTags('Academic Years')
@UseGuards(AuthenticatedGuard)
export class AcademicYearController {
  constructor(private academicYearService: AcademicYearService) {}

  @Get('/all')
  @UseGuards(AuthenticatedGuard)
  async getAcademicYears(@Req() request: Request) {
    const { login_id } = request.session.passport.user;
    return {
      academic_years: await this.academicYearService.getAcademicYears(login_id),
    };
  }

  @Post('/new')
  async addNewAcademicYear(
    @Req() request: Request,
    @Body() newAcademicYear: AcademicYearPostDto
  ) {
    const {
      school_id,
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    try {
      return {
        academic_year_id: await this.academicYearService.addNewAcademicYear(
          school_id,
          newAcademicYear,
          annual_configurator_id
        ),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':template_year_id/template')
  async templateAcademicYear(
    @Req() request: Request,
    @Body() templateOptions: TemplateYearPostDto,
    @Param('template_year_id') template_year_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    // try {
      return {
        academic_year_id: await this.academicYearService.templateAcademicYear(
          template_year_id,
          templateOptions,
          annual_configurator_id
        ),
      };
    // } catch (error) {
    //   throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }
}
