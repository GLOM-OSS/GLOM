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
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Request } from 'express';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { MajorPostDto, MajorQueryDto } from '../configurator.dto';
import { MajorService } from './major.service';

@Controller('majors')
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class MajorCotroller {
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
}
