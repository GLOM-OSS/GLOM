import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AcademicYearsService } from './academic-years.service';
import { Role, Roles } from '../auth/auth.decorator';
import { AcademicYearPostDto, TemplateYearPostDto } from './academic-years.dto';
import { User } from '../auth/auth';

@ApiTags('Academic Years')
@Controller('academic-years')
// @UseGuards(AuthenticatedGuard)
export class AcademicYearsController {
  constructor(private academicYearService: AcademicYearsService) {}

  @Get('/all')
  async getAcademicYears(@Req() request: Request) {
    const { login_id } = request.session.passport.user;
    return {
      academic_years: await this.academicYearService.findAll(login_id),
    };
  }

  @Post('/new')
  @Roles(Role.CONFIGURATOR)
  async createAcademicYear(
    @Req() request: Request,
    @Body() newAcademicYear: AcademicYearPostDto
  ) {
    const {
      school_id,
      annualConfigurator: { annual_configurator_id },
    } = request.user as User;
    return {
      academic_year_id: await this.academicYearService.create(
        school_id,
        newAcademicYear,
        annual_configurator_id
      ),
    };
  }

  @Post(':template_year_id/template')
  @Roles(Role.CONFIGURATOR)
  async templateAcademicYear(
    @Req() request: Request,
    @Body() templateOptions: TemplateYearPostDto,
    @Param('template_year_id') template_year_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as User;
    return {
      academic_year_id: await this.academicYearService.template(
        template_year_id,
        templateOptions,
        annual_configurator_id
      ),
    };
  }
}
