import { Injectable } from '@nestjs/common';
import { StaffRole } from '../../utils/enums';
import { QueryParamsDto } from '../modules.dto';
import { ConfiguratorsService } from './configurators/configurators.service';
import { CoordinatorsService } from './coordinators/coordinators.service';
import { RegistriesService } from './registries/registries.service';
import { IStaffService, StaffSelectParams } from './staff';
import { CreateStaffDto, StaffEntity } from './staff.dto';
import { TeachersService } from './teachers/teachers.service';
import { MetaParams } from '../module';
import { GlomPrismaService } from '@glom/prisma';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import * as bcrypt from 'bcrypt';
import { generatePassword } from '@glom/utils';

@Injectable()
export class StaffService {
  private staffServices: Record<StaffRole, IStaffService<StaffEntity>>;
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory,
    private teachersService: TeachersService,
    private registriesService: RegistriesService,
    private coordinatorsService: CoordinatorsService,
    private configuratorsService: ConfiguratorsService
  ) {
    this.staffServices = {
      CONFIGURATOR: this.configuratorsService,
      REGISTRY: this.registriesService,
      TEACHER: this.teachersService,
      COORDINATOR: this.coordinatorsService,
    };
  }

  async findAll(roles: StaffRole[] | 'ALL', staffParams?: StaffSelectParams) {
    const staff = await Promise.all(
      (roles === 'ALL' ? Object.keys(this.staffServices) : roles).map((role) =>
        this.staffServices[role as StaffRole].findAll(staffParams)
      )
    );

    return staff.reduce(
      (reducedStaff, staff) => [
        ...reducedStaff,
        ...staff.filter((_) =>
          reducedStaff.find((__) => _.login_id !== __.login_id)
        ),
      ],
      []
    );
  }

  async findOne(role: StaffRole, annual_personnel_id: string) {
    return this.staffServices[
      role === StaffRole.COORDINATOR ? StaffRole.TEACHER : role
    ].findOne(annual_personnel_id);
  }

  async create(
    { role, ...payload }: CreateStaffDto & MetaParams,
    created_by: string
  ) {
    const person = await this.prismaService.person.findUnique({
      where: { email: payload.email },
    });
    const matricule = await this.codeGenerator.getPersonnelCode(
      payload.school_id,
      role
    );
    const private_code = bcrypt.hashSync(
      this.codeGenerator.formatNumber(Math.floor(Math.random() * 10000)),
      Number(process.env.SALT)
    );
    return this.staffServices[role].create(
      {
        ...payload,
        matricule,
        person_id: person?.person_id,
        password: generatePassword(),
      },
      created_by,
      private_code
    );
  }
}
