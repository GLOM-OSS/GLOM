import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import {
  CreditUnitSubjectPostDto,
  CreditUnitSubjectPutDto,
} from '../coordinator.dto';

@Injectable()
export class CreditUnitSubjectService {
  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {}

  async createCreditUnitSubject(
    {
      objective,
      weighting,
      subjectParts,
      subject_title,
      subject_code,
      annual_credit_unit_id,
    }: CreditUnitSubjectPostDto,
    metaData: {
      school_id: string;
      created_by: string;
    }
  ) {
    const { school_id, created_by } = metaData;

    const annualCreditUnit =
      await this.prismaService.annualCreditUnit.findUnique({
        where: { annual_credit_unit_id },
      });
    if (!annualCreditUnit)
      throw new HttpException(
        JSON.stringify(AUTH404('Credit Unit')),
        HttpStatus.NOT_FOUND
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
    return this.prismaService.annualCreditUnitSubject.create({
      data: {
        objective,
        weighting,
        subject_title,
        subject_code: await this.codeGenerator.getCreditUnitSubjectCode(
          school_id,
          subject_code
        ),
        AnnualTeacher: { connect: { annual_teacher_id: created_by } },
        AnnualCreditUnit: { connect: { annual_credit_unit_id } },
        AnnualCreditUnitHasSubjectParts: {
          createMany: {
            data: annualCreditUnitHasSubjectParts,
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async updateCreditUnitSubject(
    annual_credit_unit_subject_id: string,
    {
      subjectParts,
      annual_credit_unit_id,
      ...newAnnualCreditUnitSubject
    }: CreditUnitSubjectPutDto,
    audited_by: string
  ) {
    const annualCreditUnitSubject =
      await this.prismaService.annualCreditUnitSubject.findUnique({
        include: {
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

    return this.prismaService.$transaction([
      this.prismaService.annualCreditUnitSubject.update({
        data: {
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
      this.prismaService.annualCreditUnitHasSubjectPart.updateMany({
        data: updatedSubjectParts,
        where: { annual_credit_unit_subject_id },
      }),
      this.prismaService.annualCreditUnitHasSubjectPartAudit.createMany({
        data: annualCreditUnitHasSubjectPartAudits,
        skipDuplicates: true,
      }),
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
}
