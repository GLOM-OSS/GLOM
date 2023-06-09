import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PresenceList } from '@squoolr/interfaces';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { PresenceListPostDto, PresenceListPutDto } from '../teacher.dto';

@Injectable()
export class PresenceListService {
  constructor(private prismaService: PrismaService) {}

  async findPresenceList(presence_list_id: string): Promise<PresenceList> {
    const presenceList = await this.prismaService.presenceList.findFirst({
      select: {
        end_time: true,
        start_time: true,
        is_deleted: true,
        is_published: true,
        presence_list_id: true,
        presence_list_date: true,
        AnnualCreditUnitSubject: {
          select: {
            subject_code: true,
            subject_title: true,
          },
        },
        PresenceListHasChapters: {
          select: {
            deleted_at: true,
            Chapter: {
              select: {
                chapter_id: true,
                chapter_title: true,
              },
            },
          },
        },
        PresenceListHasCreditUnitStudents: {
          select: {
            deleted_at: true,
            AnnualStudentHasCreditUnit: {
              select: {
                AnnualStudent: {
                  select: {
                    is_active: true,
                    annual_student_id: true,
                    AnnualClassroomDivision: {
                      select: {
                        AnnualClassroom: {
                          select: { classroom_acronym: true },
                        },
                      },
                    },
                    Student: {
                      select: {
                        matricule: true,
                        Login: {
                          select: {
                            Person: true,
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
      where: { presence_list_id, is_deleted: false },
    });
    if (presenceList) {
      const {
        AnnualCreditUnitSubject: subject,
        PresenceListHasChapters: coveredChapters,
        PresenceListHasCreditUnitStudents: presentStudents,
        ...presenceListData
      } = presenceList;
      return {
        ...subject,
        ...presenceListData,
        chapters: coveredChapters
          .filter((_) => _.deleted_at === null)
          .map(({ Chapter: chapter }) => chapter),
        students: presentStudents
          .filter((_) => _.deleted_at === null)
          .map(
            ({
              AnnualStudentHasCreditUnit: {
                AnnualStudent: {
                  is_active,
                  AnnualClassroomDivision: {
                    AnnualClassroom: { classroom_acronym },
                  },
                  Student: {
                    matricule,
                    Login: { Person: person },
                  },
                  annual_student_id,
                },
              },
            }) => ({
              matricule,
              ...person,
              is_active,
              classroom_acronym,
              annual_student_id,
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

  async updatePresenceListData(
    presence_list_id: string,
    {
      addedChapterIds,
      addedStudentIds,
      removedChapterIds,
      removedStudentIds,
      ...updatedData
    }: PresenceListPutDto,
    audited_by: string
  ) {
    const presenceList = await this.prismaService.presenceList.findUnique({
      select: {
        end_time: true,
        start_time: true,
        is_deleted: true,
        is_published: true,
        presence_list_date: true,
        annual_credit_unit_subject_id: true,
      },
      where: { presence_list_id },
    });
    if (!presenceList)
      throw new HttpException(
        JSON.stringify(AUTH404('PresenceList')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    const { annual_credit_unit_subject_id, ...presenceListData } = presenceList;

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
    return this.prismaService.$transaction([
      this.prismaService.presenceList.update({
        data: {
          ...updatedData,
          PresenceListAudits: {
            create: {
              ...presenceListData,
              audited_by,
            },
          },
          PresenceListHasChapters: {
            createMany: {
              data: addedChapterIds.map((chapter_id) => ({
                chapter_id,
                created_by: audited_by,
              })),
            },
            ...(removedChapterIds.length > 0
              ? {
                  updateMany: {
                    data: { deleted_at: new Date(), deleted_by: audited_by },
                    where: {
                      OR: removedChapterIds.map((chapter_id) => ({
                        chapter_id,
                      })),
                    },
                  },
                }
              : {}),
          },
          PresenceListHasCreditUnitStudents: {
            createMany: {
              data: addedStudentIds.map((annual_student_id) => {
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
                  created_by: audited_by,
                };
              }),
            },
            ...(removedStudentIds.length > 0
              ? {
                  updateMany: {
                    data: { deleted_at: new Date(), deleted_by: audited_by },
                    where: {
                      OR: removedStudentIds.map((annual_student_id) => {
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
                        };
                      }),
                    },
                  },
                }
              : {}),
          },
        },
        where: { presence_list_id },
      }),
    ]);
  }

  async updatePresenceList(
    presence_list_id: string,
    data: { is_deleted?: boolean; is_published?: boolean },
    audited_by: string
  ) {
    const presenceList = await this.prismaService.presenceList.findUnique({
      select: {
        end_time: true,
        start_time: true,
        is_deleted: true,
        is_published: true,
        presence_list_date: true,
      },
      where: { presence_list_id },
    });
    if (!presenceList)
      throw new HttpException(
        JSON.stringify(AUTH404('PresenceList')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    await this.prismaService.presenceList.update({
      data: {
        ...data,
        PresenceListAudits: {
          create: { ...presenceList, audited_by },
        },
      },
      where: { presence_list_id },
    });
  }

  async reinitialize(presence_list_id: string, annual_teacher_id: string) {
    const presenceList = await this.prismaService.presenceList.findFirst({
      where: { presence_list_id, is_published: false, is_deleted: false },
    });
    if (!presenceList)
      throw new HttpException(
        JSON.stringify(AUTH404('Presence list')),
        HttpStatus.NOT_FOUND
      );
    await this.prismaService.presenceList.update({
      data: {
        PresenceListHasChapters: {
          updateMany: {
            data: { deleted_at: new Date(), deleted_by: annual_teacher_id },
            where: { presence_list_id },
          },
        },
        PresenceListHasCreditUnitStudents: {
          updateMany: {
            data: { deleted_at: new Date(), deleted_by: annual_teacher_id },
            where: { presence_list_id },
          },
        },
      },
      where: { presence_list_id },
    });
  }
}
