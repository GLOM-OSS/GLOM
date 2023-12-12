import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys, generatePassword } from '@glom/utils';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { StaffRole } from '../../utils/enums';
import { MetaParams } from '../module';
import { BatchPayloadDto } from '../modules.dto';
import { ConfiguratorsService } from './configurators/configurators.service';
import { CoordinatorsService } from './coordinators/coordinators.service';
import { RegistriesService } from './registries/registries.service';
import { IStaffService, StaffSelectParams } from './staff';
import {
  CreateCoordinatorDto,
  CreateStaffPayloadDto,
  CategorizedStaffIDs,
  StaffEntity,
  StaffRoleDto,
  TeacherEntity,
  UpdateStaffPayloadDto,
  UpdateStaffRoleDto,
  UpdateStaffStatus,
} from './staff.dto';
import { TeachersService } from './teachers/teachers.service';

@Injectable()
export class StaffService {
  private staffServices: Record<
    StaffRole,
    IStaffService<StaffEntity | TeacherEntity>
  >;
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
        ...staff.filter(
          (_) => !reducedStaff.find((__) => _.login_id === __.login_id)
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
    payload: CreateStaffPayloadDto,
    metadata: MetaParams,
    created_by: string
  ) {
    if (payload instanceof CreateCoordinatorDto) {
      return this.staffServices[payload.role].create(
        excludeKeys(payload, ['role']),
        created_by
      );
    }

    const person = await this.prismaService.person.findUnique({
      where: { email: payload.email },
    });
    const matricule = await this.codeGenerator.getPersonnelCode(
      metadata.school_id,
      payload.role
    );
    const private_code = bcrypt.hashSync(
      this.codeGenerator.formatNumber(Math.floor(Math.random() * 10000)),
      Number(process.env.SALT)
    );
    return this.staffServices[payload.role].create(
      {
        matricule,
        private_code,
        password: generatePassword(),
        person_id: person?.person_id ?? randomUUID(),
        ...metadata,
        ...excludeKeys(payload, ['role']),
      },
      created_by
    );
  }

  async update(
    annual_staff_id: string,
    payload: UpdateStaffPayloadDto,
    audited_by: string,
    isAdmin = false
  ) {
    return this.staffServices[payload.role].update(
      annual_staff_id,
      excludeKeys(payload, ['role']),
      audited_by,
      isAdmin
    );
  }

  async disable(
    annual_staff_id: string,
    payload: UpdateStaffStatus,
    disabled_by: string,
    isAdmin = false
  ) {
    return this.staffServices[payload.role].update(
      annual_staff_id,
      { delete: payload.disable },
      disabled_by,
      isAdmin
    );
  }

  async disableMany(
    payload: CategorizedStaffIDs,
    disable: boolean,
    disabled_by: string,
    isAdmin = false
  ) {
    const staffIDToRole: Record<string, StaffRole> = {
      configuratorIds: StaffRole.CONFIGURATOR,
      registryIds: StaffRole.REGISTRY,
      teacherIds: StaffRole.TEACHER,
    };
    const elts = await Promise.all(
      Object.keys(staffIDToRole).reduce<Promise<void>[]>(
        (methods, key) => [
          ...methods,
          ...payload[key as keyof CategorizedStaffIDs].map((staffId) =>
            this.disable(
              staffId,
              { role: staffIDToRole[key], disable },
              disabled_by,
              isAdmin
            )
          ),
        ],
        []
      )
    );
    return new BatchPayloadDto({
      count: elts.length,
      message: `Updated ${elts.length} records in database`,
    });
  }

  async resetPasswords(
    { teacherIds, registryIds, configuratorIds }: CategorizedStaffIDs,
    disabledBy: string,
    isAdmin?: boolean
  ) {
    const getEmptyArray = () => [[]];
    const [teachers, configurators, registries] = await Promise.all([
      ...(teacherIds?.length > 0
        ? [
            this.prismaService.annualTeacher.findMany({
              select: { login_id: true },
              where: {
                OR: teacherIds.map((annual_teacher_id) => ({
                  annual_teacher_id,
                })),
              },
            }),
          ]
        : getEmptyArray()),
      ...(configuratorIds?.length > 0
        ? [
            this.prismaService.annualConfigurator.findMany({
              where: {
                OR: configuratorIds.map((annual_configurator_id) => ({
                  annual_configurator_id,
                })),
              },
            }),
          ]
        : getEmptyArray()),
      ...(registryIds?.length > 0
        ? [
            this.prismaService.annualRegistry.findMany({
              where: {
                OR: registryIds.map((annual_registry_id) => ({
                  annual_registry_id,
                })),
              },
            }),
          ]
        : getEmptyArray()),
    ]);
    const loginIds = [...registries, ...configurators, ...teachers].map(
      (_) => _.login_id
    );

    const resetPassworIds: string[] = [];
    const [created, updated] = await this.prismaService.$transaction([
      this.prismaService.resetPassword.createMany({
        data: [
          ...loginIds.map((login_id) => {
            const reset_password_id = randomUUID();
            resetPassworIds.push(reset_password_id);
            return {
              expires_at: new Date(Date.now() + 6 * 3600 * 1000),
              login_id,
              [isAdmin ? 'generated_by_admin' : 'generated_by_confiigurator']:
                disabledBy,
            };
          }),
        ],
      }),
      this.prismaService.resetPassword.updateMany({
        data: { expires_at: new Date(), is_valid: false },
        where: { OR: loginIds.map((login_id) => ({ login_id })) },
      }),
    ]);
    const count = created.count + updated.count;
    Logger.verbose(resetPassworIds, StaffService.name);
    return new BatchPayloadDto({
      count,
      message: `${count} records Affected`,
    });
  }

  async updateStaffRoles(
    login_id: string,
    {
      newRoles,
      academic_year_id,
      school_id,
      disabledStaffPayload,
      coordinatorPayload,
      teacherPayload,
    }: UpdateStaffRoleDto & MetaParams,
    audited_by: string
  ) {
    if (disabledStaffPayload)
      await this.disableMany(disabledStaffPayload, true, audited_by);

    const addedRoles: StaffRole[] = newRoles.reduce(
      (roles, role) =>
        roles.includes(role)
          ? roles
          : [
              ...roles,
              role === StaffRole.COORDINATOR ? StaffRole.TEACHER : role,
            ],
      []
    );
    let isRequiringMoreData = false;
    if (addedRoles.includes(StaffRole.TEACHER)) {
      isRequiringMoreData = !(await this.prismaService.annualTeacher.findFirst({
        where: { academic_year_id, login_id },
      }));
    }
    await Promise.all(
      addedRoles.map(async (role) => {
        const matricule = await this.codeGenerator.getPersonnelCode(
          school_id,
          role
        );
        const private_code = bcrypt.hashSync(
          this.codeGenerator.formatNumber(Math.floor(Math.random() * 10000)),
          Number(process.env.SALT)
        );
        if (role === StaffRole.TEACHER) {
          const disabledTeacher =
            await this.prismaService.annualTeacher.findFirst({
              where: { academic_year_id, login_id, is_deleted: true },
            });
          if (!disabledTeacher && !teacherPayload) {
            isRequiringMoreData = true;
            return;
          }
          return this.staffServices[role]
            .createFrom(
              login_id,
              {
                matricule,
                private_code,
                academic_year_id,
                ...(teacherPayload
                  ? excludeKeys(teacherPayload, ['role'])
                  : {}),
              },
              audited_by
            )
            .then((staff) => {
              if (coordinatorPayload && role === StaffRole.TEACHER)
                this.update(
                  staff.annual_teacher_id,
                  {
                    role: StaffRole.COORDINATOR,
                    annualClassroomIds: coordinatorPayload.annualClassroomIds,
                  },
                  audited_by
                );
            });
        }
        return this.staffServices[role].createFrom(
          login_id,
          { matricule, private_code, academic_year_id },
          audited_by
        );
      })
    ).catch(console.log);
    const totalUpdateRecords =
      addedRoles.length +
      (coordinatorPayload?.annualClassroomIds.length ?? 0) +
      Object.keys(disabledStaffPayload).reduce(
        (count, key) =>
          count + disabledStaffPayload[key as keyof CategorizedStaffIDs].length,
        0
      );
    return new BatchPayloadDto({
      count: totalUpdateRecords,
      message: `Updated ${totalUpdateRecords} records in database`,
      next_action: isRequiringMoreData
        ? "Requires teacher's payload"
        : undefined,
    });
  }

  async resetPrivateCodes(payload: CategorizedStaffIDs, reset_by: string) {
    const staffIDToRole: Record<string, StaffRole> = {
      registryIds: StaffRole.REGISTRY,
      teacherIds: StaffRole.TEACHER,
    };

    const elts = await Promise.all(
      Object.keys(staffIDToRole).reduce<Promise<void>[]>((methods, key) => {
        const staffIDKey = key as keyof CategorizedStaffIDs;
        const annualStaffIds = payload[staffIDKey];
        return [
          ...methods,
          this.staffServices[staffIDToRole[staffIDKey]].resetPrivateCodes(
            annualStaffIds,
            annualStaffIds.map(() =>
              bcrypt.hashSync(
                this.codeGenerator.formatNumber(
                  Math.floor(Math.random() * 10000)
                ),
                Number(process.env.SALT)
              )
            ),
            reset_by
          ),
        ];
      }, [])
    );
    return new BatchPayloadDto({
      count: elts.length,
      message: `Updated ${elts.length} records in database`,
    });
  }
}
