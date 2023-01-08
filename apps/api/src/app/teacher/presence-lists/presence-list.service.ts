import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { PresenceListPostDto } from '../teacher.dto';

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
            Chapter: { select: { chapter_id: true } },
          },
        },
        PresenceListHasCreditUnitStudents: {
          select: {
            AnnualStudentHasCreditUnit: {
              select: {
                annual_student_id: true,
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
        PresenceListHasChapters: coveredChapters,
        PresenceListHasCreditUnitStudents: presentStudents,
        ...presenceListData
      } = presenceList;
      const chapters = await this.prismaService.chapter.findMany({
        select: {
          chapter_id: true,
          chapter_title: true,
          chapter_parent_id: true,
        },
        where: { is_deleted: false, annual_credit_unit_subject_id },
      });
      const students = await this.prismaService.annualStudent.findMany({
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
        chapters: chapters
          .filter((_) => _.chapter_parent_id === null)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({chapter_parent_id, ...chapter}) => ({
            ...chapter,
            is_covered: Boolean(
              coveredChapters.find(
                ({ Chapter: _ }) => _.chapter_id === chapter.chapter_id
              )
            ),
          })),
        students: students.map(
          ({
            Student: {
              matricule,
              Login: {
                Person: { first_name, last_name },
              },
            },
            annual_student_id,
          }) => ({
            matricule,
            annual_student_id,
            fullname: `${first_name} ${last_name}`,
            is_present: Boolean(
              presentStudents.find(
                ({ AnnualStudentHasCreditUnit: _ }) =>
                  _.annual_student_id === annual_student_id
              )
            ),
          })
        ),
      };
    }
    return null;
  }

  async createPresenceList(
    {
      annual_credit_unit_subject_id,
      studentIds,
      chapterIds,
      ...presenceList
    }: PresenceListPostDto,
    created_by: string
  ) {
    const annualStudents =
      await this.prismaService.annualStudentHasCreditUnit.findMany({
        select: {
          annual_student_has_credit_unit_id: true,
          annual_student_id: true,
        },
        where: {
          AnnualCreditUnit: {
            AnnualCreditUnitSubjects: {
              some: { annual_credit_unit_subject_id },
            },
          },
        },
      });
    return this.prismaService.presenceList.create({
      data: {
        ...presenceList,
        AnnualCreditUnitSubject: { connect: { annual_credit_unit_subject_id } },
        PresenceListHasChapters: {
          createMany: {
            data: chapterIds.map((chapter_id) => ({ chapter_id, created_by })),
          },
        },
        PresenceListHasCreditUnitStudents: {
          createMany: {
            data: studentIds.map((annual_student_id) => {
              const annualStudent = annualStudents.find(
                (_) => _.annual_student_id === annual_student_id
              );
              if (!annualStudent)
                throw new HttpException(
                  JSON.stringify(AUTH404('Annual Student')),
                  HttpStatus.NOT_FOUND
                );
              return {
                annual_student_has_credit_unit_id:
                  annualStudent.annual_student_has_credit_unit_id,
                created_by,
              };
            }),
          },
        },
      },
    });
  }
}
