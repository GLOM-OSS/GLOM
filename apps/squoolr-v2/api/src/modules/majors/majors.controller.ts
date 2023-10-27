import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { AnnualMajorEntity, QueryMajorDto } from './major.dto';
import { MajorsService } from './majors.service';

@Controller()
@ApiTags('Majors')
@UseGuards(AuthenticatedGuard)
export class MajorsController {
  constructor(private majorsService: MajorsService) {}

  @Get('all')
  @ApiProperty({ type: [AnnualMajorEntity] })
  async getMajors(@Req() request: Request, @Query() params?: QueryMajorDto) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.majorsService.findAll(academic_year_id, params);
  }

  @Get(':annual_major_id')
  @ApiProperty({ type: AnnualMajorEntity })
  async getMajor(@Param('annual_major_id') annualMajorid: string) {
    return this.majorsService.findOne(annualMajorid);
  }
}
