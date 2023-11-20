import { GlomPrismaService } from '@glom/prisma';
import { CycleSettingMeta, ExamAccessSettingInput } from './cycle-settings';
import { ExamAccessSettingEntitty } from './cycle-settings.dto';

export class CycleSettingsService {
  constructor(private prismaService: GlomPrismaService) {}

  async getExamAccessSettings(metaParams: CycleSettingMeta) {
    const schoolSettings =
      await this.prismaService.annualSchoolSetting.findFirst({
        where: { academic_year_id: metaParams.academic_year_id },
      });
    if (!schoolSettings?.can_pay_fee) return [];
    const examAccessSettings =
      await this.prismaService.annualSemesterExamAcess.findMany({
        take: 2,
        where: metaParams,
      });
    return examAccessSettings.map(
      (accessSetting) => new ExamAccessSettingEntitty(accessSetting)
    );
  }

  async updateExamAcessSettings(
    updateSettings: [ExamAccessSettingInput, ExamAccessSettingInput],
    { academic_year_id, cycle_id }: CycleSettingMeta,
    audited_by: string
  ) {
    await this.prismaService.annualSchoolSetting.findFirstOrThrow({
      where: { academic_year_id, can_pay_fee: true },
    });
    const examAccessSettings =
      await this.prismaService.annualSemesterExamAcess.findMany({
        take: 2,
        where: { academic_year_id, cycle_id },
      });
    await this.prismaService.$transaction([
      ...updateSettings.map(({ annual_semester_number, payment_percentage }) =>
        this.prismaService.annualSemesterExamAcess.upsert({
          create: {
            payment_percentage,
            annual_semester_number,
            Cycle: { connect: { cycle_id } },
            AcademicYear: { connect: { academic_year_id } },
            CreatedBy: { connect: { annual_registry_id: audited_by } },
          },
          update: { payment_percentage },
          where: {
            academic_year_id_cycle_id_annual_semester_number: {
              academic_year_id,
              cycle_id,
              annual_semester_number,
            },
          },
        })
      ),
      this.prismaService.annualSemesterExamAcessAudit.createMany({
        data: examAccessSettings.map(
          ({ payment_percentage, annual_semester_exam_access_id }) => ({
            annual_semester_exam_access_id,
            payment_percentage,
            audited_by,
          })
        ),
      }),
    ]);
  }
}
