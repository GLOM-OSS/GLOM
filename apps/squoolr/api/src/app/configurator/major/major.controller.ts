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
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { MajorPutDto, MajorPostDto, MajorQueryDto } from '../configurator.dto';
import { MajorService } from './major.service';

@Controller()
@ApiTags('Majors')
@UseGuards(AuthenticatedGuard)
export class MajorController {
  constructor(private majorService: MajorService) {}

  @Get('all')
  async getAllMajors(
    @Req() request: Request,
    @Query() majorQuery: MajorQueryDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return {
      majors: await this.majorService.findAll(academic_year_id, majorQuery),
    };
  }

  @Get(':major_code')
  async getMajor(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return {
      major: await this.majorService.findOne(
        request.params['major_code'],
        academic_year_id
      ),
    };
  }

  @Post('new')
  @Roles(Role.CONFIGURATOR)
  async addNewMajors(@Req() request: Request, @Body() newMajor: MajorPostDto) {
    try {
      const {
        activeYear: { academic_year_id },
        annualConfigurator: { annual_configurator_id },
      } = request.user as DeserializeSessionData;
      return {
        major: await this.majorService.addNewMajor(
          newMajor,
          academic_year_id,
          annual_configurator_id
        ),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':major_code/edit')
  @Roles(Role.CONFIGURATOR)
  async editMajor(
    @Req() request: Request,
    @Param('major_code') major_code: string,
    @Body() majorData: MajorPutDto
  ) {
    try {
      const {
        activeYear: { academic_year_id },
        annualConfigurator: { annual_configurator_id },
      } = request.user as DeserializeSessionData;
      return {
        major: await this.majorService.editMajor(
          major_code,
          majorData,
          academic_year_id,
          annual_configurator_id
        ),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
