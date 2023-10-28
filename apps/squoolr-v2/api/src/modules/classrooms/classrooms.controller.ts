import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { AnnualClassroomEntity, QueryClassroomDto } from './classroom.dto';
import { ClassroomsService } from './classrooms.service';

@ApiTags('Classrooms')
@Controller('classrooms')
@UseGuards(AuthenticatedGuard)
export class ClassroomsController {
  constructor(private classroomsService: ClassroomsService) {}

  @Get('all')
  @ApiOkResponse({ type: [AnnualClassroomEntity] })
  async getClassrooms(
    @Query() { annual_major_id, ...params }: QueryClassroomDto
  ) {
    return this.classroomsService.findAll(annual_major_id, {
      annual_major_id,
      ...params,
    });
  }
}
