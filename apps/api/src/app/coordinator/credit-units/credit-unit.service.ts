import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UEMajor } from '@squoolr/interfaces';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreditUnitPostDto, CreditUnitQuery } from '../coordinator.dto';

@Injectable()
export class CreditUnitService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async getCoordinatorMajors(classroomDivisions: string[]): Promise<UEMajor[]> {
    const majors = await this.prismaService.annualClassroomDivision.findMany({
      select: {
        AnnualClassroom: {
          select: {
            Classroom: {
              select: {
                Major: {
                  select: {
                    major_id: true,
                    major_name: true,
                    Cycle: { select: { number_of_years: true } },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        is_deleted: false,
        OR: classroomDivisions.map((annual_classroom_division_id) => ({
          annual_classroom_division_id,
        })),
      },
    });
    const coordiantorMajors: UEMajor[] = [];
    majors.forEach(
      ({
        AnnualClassroom: {
          Classroom: {
            Major: {
              major_id,
              major_name,
              Cycle: { number_of_years },
            },
          },
        },
      }) => {
        if (!coordiantorMajors.find((_) => _.major_id === major_id))
          coordiantorMajors.push({ major_id, number_of_years, major_name });
      }
    );
    return coordiantorMajors;
  }

  async getCreditUnits({ majorIds, semester_number }: CreditUnitQuery) {
    return this.prismaService.annualCreditUnit.findMany({
      where: {
        semester_number,
        is_deleted: false,
        Major: { Classrooms: { some: { OR: majorIds } } },
      },
    });
  }

  async createCreditUnit(
    { major_id, credit_unit_code, ...newCreditUnit }: CreditUnitPostDto,
    metaData: {
      academic_year_id: string;
      annual_teacher_id: string;
    }
  ) {
    const { academic_year_id, annual_teacher_id } = metaData;

    return this.prismaService.annualCreditUnit.create({
      data: {
        ...newCreditUnit,
        credit_unit_code,
        Major: { connect: { major_id } },
        AcademicYear: { connect: { academic_year_id } },
        AnnualTeacher: { connect: { annual_teacher_id } },
      },
    });
  }

  async updateCreditUnit(
    annual_credit_unit_id: string,
    updateData: Prisma.AnnualCreditUnitUpdateInput,
    annual_teacher_id: string
  ) {
    const creditUnit = await this.prismaService.annualCreditUnit.findUnique({
      select: {
        is_deleted: true,
        credit_points: true,
        semester_number: true,
        credit_unit_code: true,
        credit_unit_name: true,
      },
      where: { annual_credit_unit_id },
    });
    if (!creditUnit)
      throw new HttpException(
        JSON.stringify(AUTH404('Credi Unit')),
        HttpStatus.NOT_FOUND
      );
    return this.prismaService.annualCreditUnit.update({
      data: {
        ...updateData,
        AnnualCreditUnitAudits: {
          create: {
            ...creditUnit,
            AnnualTeacher: { connect: { annual_teacher_id } },
          },
        },
      },
      where: { annual_credit_unit_id },
    });
  }
}
