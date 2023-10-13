import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DesirializeRoles, User } from '../auth/auth';
import { Role, Roles } from '../auth/auth.decorator';
import { CreateAcademicYearDto, TemplateAcademicYearDto } from './academic-years.dto';
import { AcademicYearsService } from './academic-years.service';
// import { AuthService } from '../auth/auth.service';

@ApiTags('Academic Years')
@Controller('academic-years')
// @UseGuards(AuthenticatedGuard)
export class AcademicYearsController {
  constructor(
    // private authService: AuthService,
    private academicYearService: AcademicYearsService
  ) {}

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
    @Body() newAcademicYear: CreateAcademicYearDto
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

  @Patch(':academic_year_id/choose')
  async chooseActiveAcademicYear(
    @Req() request: Request,
    @Param('academic_year_id') academic_year_id: string
  ): Promise<DesirializeRoles> {
    const { login_id } = request.session.passport.user;
    const { desirializedRoles, roles } =
      await this.academicYearService.retrieveRoles(login_id, academic_year_id);

    // await this.authService.updateSession(request, { roles, academic_year_id });
    return desirializedRoles;
  }

  @Post(':template_year_id/template')
  @Roles(Role.CONFIGURATOR)
  async templateAcademicYear(
    @Req() request: Request,
    @Body() templateOptions: TemplateAcademicYearDto,
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
