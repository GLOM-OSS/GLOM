import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CycleSettingsService } from './cycle-settings.service';
import { Request } from 'express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { ExamAccessSettingEntitty } from './cycle-settings.dto';

@ApiTags('Cycle Settings')
@Controller('cycle-settings')
@UseGuards(AuthenticatedGuard)
export class CycleSettingsController {
  constructor(private cyleSettingsService: CycleSettingsService) {}

  @Get(':cycle_id/exam-access')
  @ApiOkResponse({ type: [ExamAccessSettingEntitty] })
  async getExamAcessSettings(
    @Req() request: Request,
    @Param('cycle_id') cycleId: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.cyleSettingsService.getExamAccessSettings(
      academic_year_id,
      cycleId
    );
  }
}
