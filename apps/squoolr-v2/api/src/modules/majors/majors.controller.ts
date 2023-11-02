import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import {
  AnnualMajorEntity,
  CreateMajorDto,
  QueryMajorDto,
  UpdateMajorDto,
} from './major.dto';
import { MajorsService } from './majors.service';
import { Role, Roles } from '../../app/auth/auth.decorator';

@ApiTags('Majors')
@Controller('majors')
@UseGuards(AuthenticatedGuard)
export class MajorsController {
  constructor(private majorsService: MajorsService) {}

  @Get('all')
  @ApiProperty({ type: [AnnualMajorEntity] })
  async getMajors(@Req() request: Request, @Query() params?: QueryMajorDto) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.majorsService.findAll(academic_year_id, params);
  }

  @Get(':annual_major_id')
  @ApiProperty({ type: AnnualMajorEntity })
  async getMajor(@Param('annual_major_id') annualMajorid: string) {
    return this.majorsService.findOne(annualMajorid);
  }

  @Post('new')
  @Roles(Role.CONFIGURATOR)
  @ApiCreatedResponse({ type: AnnualMajorEntity })
  async createMajor(@Req() request: Request, @Body() newMajor: CreateMajorDto) {
    const {
      activeYear: { academic_year_id },
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.majorsService.create(
      { ...newMajor, academic_year_id },
      annual_configurator_id
    );
  }

  @Put(':annual_major_id')
  @Roles(Role.CONFIGURATOR)
  @ApiNoContentResponse()
  async updateMajor(
    @Req() request: Request,
    @Param('annual_major_id') annualMajorId: string,
    @Body() updatePayload: UpdateMajorDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.majorsService.update(
      annualMajorId,
      updatePayload,
      annual_configurator_id
    );
  }

  @Delete(':annual_major_id')
  @Roles(Role.CONFIGURATOR)
  @ApiNoContentResponse()
  async deleteMajor(
    @Req() request: Request,
    @Param('annual_major_id') annualMajorId: string
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user;
    return this.majorsService.update(
      annualMajorId,
      { is_deleted: true },
      annual_configurator_id
    );
  }
}
