import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { Role } from '../../utils/enums';
import {
  EvaluationTypeEntity,
  ExamAccessSettingEntitty,
  ModuleSettingEntity,
  QueryCycleSettingsDto,
  UpdateEvaluaTypeDto,
  UpdateExamAcessSettingDto,
  UpdateMajorSettingsDto,
  UpdateModuleSettingDto,
  UpdateWeightingSystemDto,
  WeightingSystemEntity,
} from './cycle-settings.dto';
import { CycleSettingsService } from './cycle-settings.service';

@ApiTags('Cycle Settings')
@Controller('cycle-settings')
@UseGuards(AuthenticatedGuard)
export class CycleSettingsController {
  constructor(private cyleSettingsService: CycleSettingsService) {}

  @Get('exam-access')
  @ApiOkResponse({ type: [ExamAccessSettingEntitty] })
  async getExamAcessSettings(
    @Req() request: Request,
    @Query() { cycle_id }: QueryCycleSettingsDto
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
  @Put('exam-access')
  async updateExamAcessSettings(
    @Req() request: Request,
    @Body() { cycle_id, payload }: UpdateExamAcessSettingDto
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

  @Get('evaluation-types')
  @ApiOkResponse({ type: [EvaluationTypeEntity] })
  async getEvaluationTypes(
    @Req() request: Request,
    @Query() { cycle_id }: QueryCycleSettingsDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.cyleSettingsService.getEvaluationTypes({
      academic_year_id,
      cycle_id,
    });
  }

  @ApiOkResponse()
  @Roles(Role.REGISTRY)
  @Put('evaluation-types')
  async updateEvaluationTypes(
    @Req() request: Request,
    @Body() { cycle_id, payload }: UpdateEvaluaTypeDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user;
    return this.cyleSettingsService.updateEvaluationTypes(
      payload,
      { academic_year_id, cycle_id },
      annual_registry_id
    );
  }

  @Get('module-settings')
  @ApiOkResponse({ type: ModuleSettingEntity })
  async getModuleSettings(
    @Req() request: Request,
    @Query() { cycle_id }: QueryCycleSettingsDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.cyleSettingsService.getModuleSettings({
      academic_year_id,
      cycle_id,
    });
  }

  @ApiOkResponse()
  @Roles(Role.REGISTRY)
  @Put('module-settings')
  async updateModuleSettings(
    @Req() request: Request,
    @Body() { cycle_id, ...payload }: UpdateModuleSettingDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user;
    return this.cyleSettingsService.updateModuleSettings(
      payload,
      { academic_year_id, cycle_id },
      annual_registry_id
    );
  }

  @Get('weighting-system')
  @ApiOkResponse({ type: WeightingSystemEntity })
  async getWeightingSystem(
    @Req() request: Request,
    @Query() { cycle_id }: QueryCycleSettingsDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.cyleSettingsService.getWeightingSystem({
      academic_year_id,
      cycle_id,
    });
  }

  @ApiOkResponse()
  @Roles(Role.REGISTRY)
  @Put('weighting-system')
  async updateWeightingSystem(
    @Req() request: Request,
    @Body() { cycle_id, weighting_system }: UpdateWeightingSystemDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user;
    return this.cyleSettingsService.updateWeightingSystem(
      weighting_system,
      { academic_year_id, cycle_id },
      annual_registry_id
    );
  }

  @ApiOkResponse()
  @Roles(Role.REGISTRY)
  @Put('major-settings')
  async updateMajorSettings(
    @Req() request: Request,
    @Body() majorSettings: UpdateMajorSettingsDto
  ) {
    const {
      annualRegistry: { annual_registry_id },
    } = request.user;
    return this.cyleSettingsService.updateMajorSettings(
      majorSettings,
      annual_registry_id
    );
  }
}