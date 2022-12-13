import { Injectable } from '@nestjs/common';
import { UEMajor } from '@squoolr/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';

export interface MajorId {
  major_id: string;
}

@Injectable()
export class CreditUnitService {
  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
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
}
