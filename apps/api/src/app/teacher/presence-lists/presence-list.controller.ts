import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { PresenceListService } from './presence-list.service';

@Controller()
@ApiTags('Presence Lists')
@UseGuards(AuthenticatedGuard)
export class PresenceListController {
  constructor(private presenceService: PresenceListService) {}

  @Get(':presence_list_id')
  async getAllPresences(@Param('presence_list_id') presence_list_id: string) {
    return this.presenceService.findAll(presence_list_id);
  }
}
