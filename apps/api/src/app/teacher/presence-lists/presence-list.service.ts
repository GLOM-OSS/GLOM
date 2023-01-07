import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PresenceListService {
  constructor(private prismaService: PrismaService) {}

  async findPresenceList(presence_list_id: string) {
    const presenceList = await this.prismaService.presenceList.findUnique({
      select: {
        end_time: true,
        start_time: true,
        is_published: true,
        presence_list_date: true,
        AnnualCreditUnitSubject: {
          select: {
            annual_credit_unit_subject_id: true,
            subject_code: true,
            subject_title: true,
          },
        },
        PresenceListHasChapters: {
          select: {
            Chapter: { select: { chapter_id: true, chapter_title: true } },
          },
        },
        PresenceListHasCreditUnitStudents: {
          select: {
            AnnualStudentHasCreditUnit: {
              select: {
                AnnualStudent: {
                  select: {
                    annual_student_id: true,
                    Student: {
                      select: {
                        matricule: true,
                        Login: {
                          select: {
                            Person: {
                              select: { first_name: true, last_name: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: { presence_list_id },
    });
    if (presenceList) {
      const {
        AnnualCreditUnitSubject: { annual_credit_unit_subject_id, ...subject },
        PresenceListHasChapters,
        PresenceListHasCreditUnitStudents,
        ...presenceListData
      } = presenceList;
      const chapters = await this.prismaService.chapter.findMany({
        select: { chapter_id: true },
        where: { is_deleted: false, annual_credit_unit_subject_id },
      });
      const students = await this.prismaService.annualStudent.findMany({
        select: { annual_student_id: true },
        where: {
          is_deleted: false,
          AnnualStudentHasCreditUnits: {
            some: {
              is_active: true,
              AnnualCreditUnit: {
                AnnualCreditUnitSubjects: {
                  some: { annual_credit_unit_subject_id },
                },
              },
            },
          },
        },
      });
      return {
        ...subject,
        ...presenceListData,
        chapters: PresenceListHasChapters.map(({ Chapter: chapter }) => ({
          ...chapter,
          is_covered: Boolean(
            chapters.find((_) => _.chapter_id === chapter.chapter_id)
          ),
        })),
        students: PresenceListHasCreditUnitStudents.map(
          ({
            AnnualStudentHasCreditUnit: {
              AnnualStudent: {
                Student: {
                  matricule,
                  Login: {
                    Person: { first_name, last_name },
                  },
                },
                annual_student_id,
              },
            },
          }) => ({
            matricule,
            annual_student_id,
            fullname: `${first_name} ${last_name}`,
            is_present: Boolean(
              students.find((_) => _.annual_student_id === annual_student_id)
            ),
          })
        ),
      };
    }
    return null;
  }
}
