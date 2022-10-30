import {
  Body,
  Controller, HttpException,
  HttpStatus,
  Param, Put, Req,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { ResetPasswordDto } from '../../auth/auth.dto';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  StaffPutDto
} from '../configurator.dto';
import { PersonnelService } from './personnel.service';

@Controller()
@ApiTags('Personnel')
@Roles(Role.CONFIGURATOR)
@UseGuards(AuthenticatedGuard)
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  @Put('reset-password')
  async resetPassword(
    @Req() request: Request,
    @Body() { email }: ResetPasswordDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    const squoolr_client = new URL(request.headers.origin).hostname;

    try {
      const { reset_password_id } = await this.personnelService.resetPassword(
        email,
        squoolr_client,
        annual_configurator_id
      );
      return {
        reset_link: `${request.headers.origin}/forgot-password/${reset_password_id}/new-password`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':login_id/edit')
  async editStaff(
    @Req() request: Request,
    @Param('login_id') login_id: string,
    @Body() staffData: StaffPutDto
  ) {
    const {
      annualConfigurator: { annual_configurator_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.personnelService.editStaff(
        login_id,
        staffData,
        annual_configurator_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
