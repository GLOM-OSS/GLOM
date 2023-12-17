import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const seedData = async (prisma: PrismaClient) => {
  const seeder = new AppSeederFactory(prisma);

  //seed app settings
  await seeder.seedPlatformSettings();
  //seed default admin account
  const adminId = await seeder.seedDefautAdmin();
  //seed first ambassador
  await seeder.seedFirstAmbassador(adminId);
  //seed teacher types
  await seeder.seedTeacherTypes();
  //seed teaching grades
  await seeder.seedTeachingGrades();
  //seed cycles
  await seeder.seedCycles();
  //seed subject parts
  await seeder.seedSubjectParts();
};

export class AppSeederFactory {
  constructor(private prismaService: PrismaClient) {}

  async seedPlatformSettings() {
    const settingsId = '2eed9593-b796-4b2d-b9e8-98dd005b9b7b';
    const data: Prisma.PlatformSettingsCreateInput = {
      platform_settings_id: settingsId,
      platform_fee: Number(process.env.PLATFORM_FEE),
      onboarding_fee: Number(process.env.ONBOARDING_FEE),
    };

    await this.prismaService.platformSettings.upsert({
      create: data,
      update: data,
      where: { platform_settings_id: settingsId },
    });
    return settingsId;
  }

  async seedDefautAdmin() {
    const adminId = '4ad3d1eb-c52c-474e-9eac-fd4f1079f496';
    const data: Prisma.LoginCreateInput = {
      login_id: adminId,
      password: bcrypt.hashSync(
        process.env.ADMIN_PASSWORD,
        Number(process.env.SALT)
      ),
      Person: {
        connectOrCreate: {
          where: { email: 'glomexam@gmail.com' },
          create: {
            gender: 'Male',
            first_name: 'eXam',
            last_name: 'Glom',
            email: 'glomexam@gmail.com',
            phone_number: '+237673016895',
          },
        },
      },
    };
    await this.prismaService.login.upsert({
      create: data,
      update: data,
      where: { login_id: adminId },
    });
    return adminId;
  }

  async seedFirstAmbassador(adminId: string) {
    const ambassadorId = '755eb2cb-48aa-422a-8ad4-a0fef4d8cc32';
    const data: Prisma.AmbassadorCreateInput = {
      referral_code: Math.random().toFixed(16).split('.')[1],
      ambassador_id: ambassadorId,
      Login: {
        connect: {
          login_id: adminId,
        },
      },
    };
    await this.prismaService.ambassador.upsert({
      create: data,
      update: data,
      where: { ambassador_id: ambassadorId },
    });
  }

  async seedTeacherTypes() {
    // vacataire, permanent, missionnaire
    await this.prismaService.teacherType.createMany({
      data: [
        {
          teacher_type_id: 'd1299d68-9450-4d45-a340-4fef60ae159b',
          teacher_type: 'PART_TIME',
        },
        {
          teacher_type_id: '3ad91464-5c97-45f8-b95a-6e6cc94e92b9',
          teacher_type: 'PERMAMENT',
        },
        {
          teacher_type_id: 'c2d49fa9-98c3-42f0-a546-437a6ddd059f',
          teacher_type: 'MISSIONARY',
        },
      ],
      skipDuplicates: true,
    });
  }

  async seedTeachingGrades() {
    await this.prismaService.teachingGrade.createMany({
      data: [
        {
          teaching_grade_id: 'c114f260-8e89-4bdf-951b-1b1a166225cb',
          teaching_grade: 'CLASS_C',
        },
        {
          teaching_grade_id: 'a9a94997-bdb5-4b69-9743-219428deda7b',
          teaching_grade: 'CLASS_D',
        },
        {
          teaching_grade_id: '6bcf44dd-47c4-44a9-9e65-07434f8546ef',
          teaching_grade: 'LECTURER',
        },
        {
          teaching_grade_id: '57f7e2ec-1635-472a-bbea-85f76d4b47f2',
          teaching_grade: 'COURSE_INSTRUTOR',
        },
        {
          teaching_grade_id: '9f20bf3d-4ecc-493a-9a9d-9eb5817f979c',
          teaching_grade: 'ASSISTANT',
        },
      ],
      skipDuplicates: true,
    });
  }

  async seedCycles() {
    await this.prismaService.cycle.createMany({
      data: [
        {
          cycle_id: 'd1591ab7-401b-42a2-b63e-aa05bf6e6d2d',
          cycle_name: 'BACHELOR',
          number_of_years: 3,
        },
        {
          cycle_id: 'c2955afe-4596-423b-9759-38200de9698e',
          cycle_name: 'DUT',
          number_of_years: 2,
        },
        {
          cycle_id: '593ca811-fa34-40dc-a4d5-3d0690df4859',
          cycle_name: 'DTS',
          number_of_years: 2,
        },
        {
          cycle_id: 'ada232fb-764b-4191-a615-f3a75e5e717f',
          cycle_name: 'DUT',
          number_of_years: 2,
        },
        {
          cycle_id: 'c5dd02f0-92d6-4e7c-ae5a-001bf4dda757',
          cycle_name: 'MASTER',
          number_of_years: 2,
        },
        {
          cycle_id: '9783f126-5b64-4659-9870-4556f9b8344b',
          cycle_name: 'MASTER',
          number_of_years: 5,
        },
        {
          cycle_id: 'd1299d68-9450-4d45-a340-4fef60ae159b',
          cycle_name: 'DOCTORATE',
          number_of_years: 7,
        },
        {
          cycle_id: '11aa093f-e983-4f18-a40a-10b20bb2d069',
          cycle_name: 'DOCTORATE',
          number_of_years: 2,
        },
      ],
      skipDuplicates: true,
    });
  }

  async seedSubjectParts() {
    await this.prismaService.subjectPart.createMany({
      data: [
        {
          subject_part_id: 'f1ccf3c3-d854-4a4b-85ff-52dd130ac911',
          subject_part_name: 'CM',
        },
        {
          subject_part_id: 'c0f12af7-b762-41ff-ad8f-2002adfe1e0e',
          subject_part_name: 'TD',
        },
        {
          subject_part_id: 'c292bd43-f249-41ee-845c-ee6cb829f8c3',
          subject_part_name: 'TP',
        },
      ],
      skipDuplicates: true,
    });
  }
}
