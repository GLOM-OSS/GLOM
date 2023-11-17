import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { Role } from '../../utils/enums';
import {
  ExamAccessSettingEntitty,
  UpdateExamAcessSettingDto,
} from './cycle-settings.dto';
import { CycleSettingsService } from './cycle-settings.service';

@ApiTags('Cycle Settings')
@Controller('cycle-settings')
@UseGuards(AuthenticatedGuard)
export class CycleSettingsController {
  constructor(private cyleSettingsService: CycleSettingsService) {}

  @Get(':cycle_id/exam-access')
  @ApiOkResponse({ type: [ExamAccessSettingEntitty] })
  async getExamAcessSettings(
    @Req() request: Request,
    @Param('cycle_id') cycle_id: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.cyleSettingsService.getExamAccessSettings({
      academic_year_id,
      cycle_id,
    });
  }

  @ApiOkResponse()
  @Roles(Role.REGISTRY)
  @Put(':cycle_id/exam-access')
  async updateExamAcessSettings(
    @Req() request: Request,
    @Param('cycle_id') cycle_id: string,
    @Body() { payload }: UpdateExamAcessSettingDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user;
    return this.cyleSettingsService.updateExamAcessSettings(
      payload,
      { academic_year_id, cycle_id },
      annual_registry_id
    );
  }
}
