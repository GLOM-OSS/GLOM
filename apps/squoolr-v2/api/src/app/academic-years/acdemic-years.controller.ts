import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role, Roles } from '../auth/auth.decorator';
import {
  AcademicYearEntity,
  CreateAcademicYearDto,
  TemplateAcademicYearDto,
} from './academic-years.dto';
import { AcademicYearsService } from './academic-years.service';
import { DesirializedRoles } from '../auth/auth.dto';
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
  @ApiOkResponse({ type: [AcademicYearEntity] })
  async getAcademicYears(@Req() request: Request) {
    const { login_id } = request.session.passport.user;
    return {
      academic_years: await this.academicYearService.findAll(login_id),
    };
  }

  @Post('/new')
  @Roles(Role.CONFIGURATOR)
  @ApiOkResponse({ type: AcademicYearEntity })
  async createAcademicYear(
    @Req() request: Request,
    @Body() newAcademicYear: CreateAcademicYearDto
  ) {
    const {
      school_id,
      annualConfigurator: { annual_configurator_id },
    } = request.user as Express.User;
    return this.academicYearService.create(
      school_id,
      newAcademicYear,
      annual_configurator_id
    );
  }

  @Patch(':academic_year_id/choose')
  @ApiOkResponse({ type: DesirializedRoles })
  async chooseActiveAcademicYear(
    @Req() request: Request,
    @Param('academic_year_id') academic_year_id: string
  ) {
    const { login_id } = request.session.passport.user;
    // const { desirializedRoles, roles } =
    const { desirializedRoles } = await this.academicYearService.retrieveRoles(
      login_id,
      academic_year_id
    );

    // await this.authService.updateSession(request, { roles, academic_year_id });
    return desirializedRoles;
  }

  @ApiExcludeEndpoint()
  @Roles(Role.CONFIGURATOR)
  @Post(':template_year_id/template')
  async templateAcademicYear(
    @Req() request: Request,
    @Body() templateOptions: TemplateAcademicYearDto,
    @Param('template_year_id') template_year_id: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as Express.User;
    return {
      academic_year_id: await this.academicYearService.template(
        template_year_id,
        templateOptions,
        annual_configurator_id
      ),
    };
  }
}
