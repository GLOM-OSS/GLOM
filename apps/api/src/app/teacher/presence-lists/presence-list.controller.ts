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
import { DeserializeSessionData, Role } from 'apps/api/src/utils/types';
import { Request } from 'express';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { PresenceListPostDto } from '../teacher.dto';
import { PresenceListService } from './presence-list.service';

@Controller()
@ApiTags('Presence Lists')
@UseGuards(AuthenticatedGuard)
export class PresenceListController {
  constructor(private presenceService: PresenceListService) {}

  @Get(':presence_list_id')
  async getAllPresenceLists(
    @Param('presence_list_id') presence_list_id: string
  ) {
    return this.presenceService.findPresenceList(presence_list_id);
  }

  @Post('new')
  @Roles(Role.TEACHER)
  async createPresenceList(
    @Req() request: Request,
    @Body() newPresenceList: PresenceListPostDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.presenceService.createPresenceList(
        newPresenceList,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
