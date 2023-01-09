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
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { PresenceListPostDto, PresenceListPutDto } from '../teacher.dto';
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

  @Put(':presence_list_id/edit')
  @Roles(Role.TEACHER)
  async updatePresenceList(
    @Req() request: Request,
    @Param('presence_list_id') presence_list_id: string,
    @Body() updateData: PresenceListPutDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.presenceService.updatePresenceListData(
        presence_list_id,
        updateData,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':presence_list_id/publish')
  @Roles(Role.TEACHER)
  async publishPresenceList(
    @Req() request: Request,
    @Param('presence_list_id') presence_list_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.presenceService.updatePresenceList(
        presence_list_id,
        { is_published: true },
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':presence_list_id/delete')
  @Roles(Role.TEACHER)
  async deletePresenceList(
    @Req() request: Request,
    @Param('presence_list_id') presence_list_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.presenceService.updatePresenceList(
        presence_list_id,
        { is_deleted: true },
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
