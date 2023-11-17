import { GlomPrismaService } from '@glom/prisma';
import { ExamAccessSettingEntitty } from './cycle-settings.dto';

export class CycleSettingsService {
  constructor(private prismaService: GlomPrismaService) {}

  async getExamAccessSettings(academic_year_id: string, cycle_id: string) {
    const examAccessSettings =
      await this.prismaService.annualSemesterExamAcess.findMany({
        take: 2,
        where: { academic_year_id, cycle_id },
      });
    return examAccessSettings.map(
      (accessSetting) => new ExamAccessSettingEntitty(accessSetting)
    );
  }
}
