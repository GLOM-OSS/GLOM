import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { AUTH404, ERR10 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreditUnitSubjectPostDto,
  CreditUnitSubjectPutDto,
} from '../coordinator.dto';

@Injectable()
export class CreditUnitSubjectService {
  constructor(private prismaService: PrismaService) {}

  async createCreditUnitSubject(
    {
      objective,
      weighting,
      subjectParts,
      subject_title,
      subject_code,
      annual_credit_unit_id,
    }: CreditUnitSubjectPostDto,
    created_by: string
  ) {
    const annualCreditUnit =
      await this.prismaService.annualCreditUnit.findUnique({
        where: { annual_credit_unit_id },
      });
    if (!annualCreditUnit)
      throw new HttpException(
        JSON.stringify(AUTH404('Credit Unit')),
        HttpStatus.NOT_FOUND
      );
    const subjects = await this.prismaService.annualCreditUnitSubject.findMany({
      select: { weighting: true },
      where: { annual_credit_unit_id },
    });
    const totalWeight = subjects.reduce(
      (total, { weighting }) => total + weighting,
      0
    );
    if (weighting > 1 - totalWeight)
      throw new HttpException(
        JSON.stringify(ERR10),
        HttpStatus.EXPECTATION_FAILED
      );

    const allSubjectParts = await this.prismaService.subjectPart.findMany();
    const annualCreditUnitHasSubjectParts = allSubjectParts.map(
      ({ subject_part_id }) => {
        const subjectPart = subjectParts.find(
          (_) => _.subject_part_id === subject_part_id
        );
        return {
          created_by,
          subject_part_id,
          number_of_hours: subjectPart?.number_of_hours ?? 0,
          annual_teacher_id: subjectParts[0].annual_teacher_id,
        };
      }
    );
    const evaluationSubTypes =
      await this.prismaService.annualEvaluationSubType.findMany({
        where: {
          evaluation_sub_type_name: { in: ['CA', 'EXAM'] },
          academic_year_id: annualCreditUnit.academic_year_id,
        },
      });
    return this.prismaService.annualCreditUnitSubject.create({
      data: {
        objective,
        weighting,
        subject_code,
        subject_title,
        AnnualTeacher: { connect: { annual_teacher_id: created_by } },
        AnnualCreditUnit: { connect: { annual_credit_unit_id } },
        AnnualCreditUnitHasSubjectParts: {
          createMany: {
            data: annualCreditUnitHasSubjectParts,
            skipDuplicates: true,
          },
        },
        Evaluations: {
          createMany: {
            data: evaluationSubTypes.map(
              ({ annual_evaluation_sub_type_id }) => ({
                annual_evaluation_sub_type_id,
                created_by,
              })
            ),
          },
        },
      },
    });
  }

  async updateCreditUnitSubject(
    annual_credit_unit_subject_id: string,
    {
      weighting,
      subjectParts,
      annual_credit_unit_id,
      ...newAnnualCreditUnitSubject
    }: CreditUnitSubjectPutDto,
    audited_by: string
  ) {
    const annualCreditUnitSubject =
      await this.prismaService.annualCreditUnitSubject.findUnique({
        select: {
          is_deleted: true,
          objective: true,
          subject_code: true,
          subject_title: true,
          weighting: true,
          AnnualCreditUnitHasSubjectParts: {
            select: {
              number_of_hours: true,
              subject_part_id: true,
              annual_teacher_id: true,
              annual_credit_unit_subject_id: true,
              annual_credit_unit_has_subject_part_id: true,
            },
          },
        },
        where: { annual_credit_unit_subject_id },
      });
    if (!annual_credit_unit_subject_id)
      throw new HttpException(
        JSON.stringify(AUTH404('Credit Unit Subject')),
        HttpStatus.NOT_FOUND
      );
    const subjects = await this.prismaService.annualCreditUnitSubject.findMany({
      select: { weighting: true },
      where: {
        annual_credit_unit_id,
        annual_credit_unit_subject_id: { not: annual_credit_unit_subject_id },
      },
    });
    const totalWeight = subjects.reduce(
      (total, { weighting }) => total + weighting,
      0
    );
    if (weighting && weighting > 1 - totalWeight)
      throw new HttpException(
        JSON.stringify(ERR10),
        HttpStatus.EXPECTATION_FAILED
      );
    const {
      AnnualCreditUnitHasSubjectParts: oldSubjectParts,
      ...annualCreditUnitSubjectData
    } = annualCreditUnitSubject;

    const updatedSubjectParts: {
      subject_part_id: string;
      number_of_hours: number;
      annual_teacher_id: string;
      annual_credit_unit_subject_id: string;
    }[] = [];
    subjectParts.forEach(
      ({ number_of_hours, subject_part_id, annual_teacher_id }) => {
        const subjectPart = oldSubjectParts.find(
          (_) => _.subject_part_id === subject_part_id
        );
        if (subjectPart.number_of_hours !== number_of_hours)
          updatedSubjectParts.push({
            subject_part_id,
            number_of_hours,
            annual_teacher_id,
            annual_credit_unit_subject_id,
          });
      }
    );
    const annualCreditUnitHasSubjectPartAudits = oldSubjectParts
      .filter((oldPart) =>
        updatedSubjectParts.find(
          (_) => _.subject_part_id === oldPart.subject_part_id
        )
      )
      .map((part) => ({ ...part, audited_by: audited_by }));

    let updateTransactionInstruction: PrismaPromise<Prisma.BatchPayload>[] = [];
    if (updatedSubjectParts.length > 0)
      updateTransactionInstruction = [
        this.prismaService.annualCreditUnitHasSubjectPart.updateMany({
          data: updatedSubjectParts,
          where: { annual_credit_unit_subject_id },
        }),
        this.prismaService.annualCreditUnitHasSubjectPartAudit.createMany({
          data: annualCreditUnitHasSubjectPartAudits,
          skipDuplicates: true,
        }),
      ];
    return this.prismaService.$transaction([
      this.prismaService.annualCreditUnitSubject.update({
        data: {
          weighting,
          ...newAnnualCreditUnitSubject,
          AnnualTeacher: { connect: { annual_teacher_id: audited_by } },
          AnnualCreditUnit: { connect: { annual_credit_unit_id } },
          AnnualCreditUnitSubjectAudits: {
            create: {
              ...annualCreditUnitSubjectData,
              AnnualTeacher: { connect: { annual_teacher_id: audited_by } },
            },
          },
        },
        where: { annual_credit_unit_subject_id },
      }),
      ...updateTransactionInstruction,
    ]);
  }

  async getCreditUnitSubjects(annual_credit_unit_id: string) {
    const annualCreditUnitSubjects =
      await this.prismaService.annualCreditUnitSubject.findMany({
        include: {
          AnnualCreditUnitHasSubjectParts: {
            orderBy: { SubjectPart: { subject_part_name: 'asc' } },
            include: {
              SubjectPart: { select: { subject_part_name: true } },
              AnnualTeacher: {
                select: {
                  Login: {
                    select: {
                      Person: { select: { first_name: true, last_name: true } },
                    },
                  },
                },
              },
            },
          },
        },
        where: { annual_credit_unit_id, is_deleted: false },
      });
    return annualCreditUnitSubjects.map(
      ({
        AnnualCreditUnitHasSubjectParts: subjectParts,
        ...annualCreditUnitSubject
      }) => {
        const {
          AnnualTeacher: {
            Login: {
              Person: { first_name, last_name },
            },
          },
        } = subjectParts[0];
        return {
          ...annualCreditUnitSubject,
          main_teacher_fullname: `${first_name} ${last_name}`,
          subjectParts: subjectParts.map(
            ({ annual_teacher_id, number_of_hours, subject_part_id }) => ({
              annual_teacher_id,
              number_of_hours,
              subject_part_id,
            })
          ),
        };
      }
    );
  }

  async getCreditUnitSubjectDetails(credit_unit_subject_id_or_code: string) {
    const annualCreditUnitSubject =
      await this.prismaService.annualCreditUnitSubject.findFirst({
        include: {
          AnnualCreditUnitHasSubjectParts: {
            orderBy: { SubjectPart: { subject_part_name: 'asc' } },
            include: {
              SubjectPart: { select: { subject_part_name: true } },
              AnnualTeacher: {
                select: {
                  Login: {
                    select: {
                      Person: { select: { first_name: true, last_name: true } },
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          OR: [
            { subject_code: credit_unit_subject_id_or_code },
            { annual_credit_unit_subject_id: credit_unit_subject_id_or_code },
          ],
          is_deleted: false,
        },
      });
    if (!annualCreditUnitSubject)
      throw new HttpException(
        JSON.stringify(AUTH404('Credit Unit Subject')),
        HttpStatus.NOT_FOUND
      );
    const {
      AnnualCreditUnitHasSubjectParts: subjectParts,
      ...annualCreditUnitSubjectData
    } = annualCreditUnitSubject;
    return {
      ...annualCreditUnitSubjectData,
      subjectParts: subjectParts.map(
        ({ annual_teacher_id, number_of_hours, subject_part_id }) => ({
          annual_teacher_id,
          number_of_hours,
          subject_part_id,
        })
      ),
    };
  }

  async deleteCreditUnitSubject(
    annual_credit_unit_subject_id: string,
    annual_teacher_id: string
  ) {
    const annualCreditUnitSubject =
      await this.prismaService.annualCreditUnitSubject.findUnique({
        select: {
          is_deleted: true,
          objective: true,
          subject_code: true,
          subject_title: true,
          weighting: true,
        },
        where: { annual_credit_unit_subject_id },
      });
    if (!annualCreditUnitSubject)
      throw new HttpException(
        JSON.stringify(AUTH404('Credit Unit Subject')),
        HttpStatus.NOT_FOUND
      );

    return this.prismaService.annualCreditUnitSubject.update({
      data: {
        is_deleted: true,
        AnnualCreditUnitSubjectAudits: {
          create: {
            ...annualCreditUnitSubject,
            AnnualTeacher: { connect: { annual_teacher_id } },
          },
        },
      },
      where: { annual_credit_unit_subject_id },
    });
  }
}
