import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Request } from 'express';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  AnnualMajorPutDto,
  MajorPostDto,
  MajorQueryDto,
} from '../configurator.dto';
import { MajorService } from './major.service';

@Controller('majors')
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class MajorController {
  constructor(private majorService: MajorService) {}

  @Get('all')
  async getAllMajors(@Param() where: MajorQueryDto) {
    return { majors: await this.majorService.findAll(where) };
  }

  @Post('new')
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
  async editMajor(
    @Req() request: Request,
    @Param('major_code') major_code: string,
    @Body() data: AnnualMajorPutDto
  ) {
    try {
      const {
        activeYear: { academic_year_id },
        annualConfigurator: { annual_configurator_id },
      } = request.user as DeserializeSessionData;
      return {
        major: await this.majorService.editMajor(
          major_code,
          data,
          academic_year_id,
          annual_configurator_id
        ),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':major_code/delete')
  async toogleArchive(
    @Req() request: Request,
    @Param('major_code') major_code: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return {
      major: await this.majorService.toogleArchive(
        major_code,
        academic_year_id
      ),
    };
  }
}
