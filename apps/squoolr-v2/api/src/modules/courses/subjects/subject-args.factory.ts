import { Prisma } from '@prisma/client';
import { SubjectEntity } from './subject.dto';

export class SubjectArgsFactory {
  static getSelectArgs = () =>
    Prisma.validator<Prisma.AnnualModuleHasSubjectArgs>()({
      include: {
        AnnualSubject: {
          include: {
            AnnualSubjectParts: {
              select: {
                number_of_hours: true,
                annual_teacher_id: true,
                SubjectPart: true,
              },
            },
          },
        },
        AnnualModule: {
          select: {
            credit_points: true,
            semester_number: true,
            annual_classroom_id: true,
            is_subject_module: true,
          },
        },
      },
    });
  private static subjectSelect = SubjectArgsFactory.getSelectArgs();
  static getSubjectEntity = ({
    AnnualSubject: { AnnualSubjectParts: parts, ...subject },
    AnnualModule: { is_subject_module, ...courseModule },
    annual_module_has_subject_id,
    ...moduleSubject
  }: Prisma.AnnualModuleHasSubjectGetPayload<
    typeof SubjectArgsFactory.subjectSelect
  >) => {
    return new SubjectEntity({
      ...subject,
      ...moduleSubject,
      annual_subject_id: annual_module_has_subject_id,
      module: is_subject_module ? courseModule : undefined,
      subjectParts: parts.map(
        ({
          SubjectPart: { subject_part_id, subject_part_name },
          annual_teacher_id,
          number_of_hours,
        }) => ({
          annual_teacher_id,
          subject_part_id,
          subject_part_name,
          number_of_hours,
        })
      ),
    });
  };
}
