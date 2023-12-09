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
}
