import { GlomPrismaService } from '@glom/prisma';
import {
  CycleSettingMeta,
  EvaluationTypeInput,
  ExamAccessSettingInput,
  ModuleSettingInput,
} from './cycle-settings';
import {
  EvaluationTypeEntity,
  ExamAccessSettingEntitty,
  ModuleSettingEntity,
} from './cycle-settings.dto';

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

  async getEvaluationTypes(metaParams: CycleSettingMeta) {
    const evaluationTypes =
      await this.prismaService.annualEvaluationType.findMany({
        where: metaParams,
      });
    return evaluationTypes.map(
      (evaluationType) => new EvaluationTypeEntity(evaluationType)
    );
  }

  async updateEvaluationTypes(
    updatePayload: [EvaluationTypeInput, EvaluationTypeInput],
    metaParams: CycleSettingMeta,
    audited_by: string
  ) {
    const evaluationTypeAudits =
      await this.prismaService.annualEvaluationType.findMany({
        take: 2,
        select: {
          annual_evaluation_type_id: true,
          evaluation_type_weight: true,
        },
        where: metaParams,
      });
    await this.prismaService.$transaction([
      ...updatePayload.map(({ evaluation_type, evaluation_type_weight }) =>
        this.prismaService.annualEvaluationType.upsert({
          create: {
            evaluation_type,
            evaluation_type_weight,
            Cycle: { connect: { cycle_id: metaParams.cycle_id } },
            AcademicYear: {
              connect: { academic_year_id: metaParams.academic_year_id },
            },
            CreatedBy: { connect: { annual_registry_id: audited_by } },
            AnnualEvaluationSubtypes: {
              create: {
                evaluation_subtype_name: evaluation_type,
                evaluation_subtype_weight: 100,
                CreatedBy: { connect: { annual_registry_id: audited_by } },
              },
            },
          },
          update: { evaluation_type_weight },
          where: {
            academic_year_id_cycle_id_evaluation_type: {
              ...metaParams,
              evaluation_type,
            },
          },
        })
      ),
      this.prismaService.annualEvaluationTypeAudit.createMany({
        data: evaluationTypeAudits.map((evaluationTypeAudit) => ({
          ...evaluationTypeAudit,
          audited_by,
        })),
      }),
    ]);
  }

  async getModuleSettings(metaParams: CycleSettingMeta) {
    const moduleSetting =
      await this.prismaService.annualModuleSetting.findFirst({
        where: metaParams,
      });
    return new ModuleSettingEntity(moduleSetting);
  }

  async updateModuleSettings(
    updatePayload: ModuleSettingInput,
    metaParams: CycleSettingMeta,
    audited_by: string
  ) {
    const moduleSetting =
      await this.prismaService.annualModuleSetting.findFirst({
        select: { carry_over_system: true, minimum_modulation_score: true },
        where: metaParams,
      });
    await this.prismaService.annualModuleSetting.upsert({
      create: {
        ...updatePayload,
        AnnualModuleSettingAudits: moduleSetting
          ? {
              create: {
                ...moduleSetting,
                AuditedBy: { connect: { annual_registry_id: audited_by } },
              },
            }
          : undefined,
        AcademicYear: {
          connect: { academic_year_id: metaParams.academic_year_id },
        },
        Cycle: { connect: { cycle_id: metaParams.cycle_id } },
        CreatedBy: { connect: { annual_registry_id: audited_by } },
      },
      update: updatePayload,
      where: { academic_year_id_cycle_id: metaParams },
    });
  }
}
