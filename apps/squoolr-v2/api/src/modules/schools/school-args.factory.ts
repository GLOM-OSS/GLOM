import { Prisma } from '@prisma/client';
import { SchoolEntity } from './schools.dto';

export class SchoolArgsFactory {
  static getSchoolSelect = () =>
    Prisma.validator<Prisma.SchoolArgs>()({
      include: {
        SchoolDemand: {
          include: {
            Payment: true,
            Ambassador: {
              select: {
                Login: {
                  select: {
                    Person: { select: { email: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

  private static schoolSelectAttr = SchoolArgsFactory.getSchoolSelect();
  static getSchoolEntity = (
    data: Prisma.SchoolGetPayload<typeof SchoolArgsFactory.schoolSelectAttr>
  ) => {
    const {
      SchoolDemand: {
        demand_status,
        rejection_reason,
        Payment: { amount: paid_amount },
        Ambassador,
      },
      ...school
    } = data;
    return new SchoolEntity({
      ...school,
      paid_amount,
      school_demand_status: demand_status,
      school_rejection_reason: rejection_reason,
      ambassador_email: Ambassador?.Login.Person.email,
    });
  };
}
