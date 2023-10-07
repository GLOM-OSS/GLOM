import { GlomPrismaService } from '@glom/prisma';
import { GlomAuthModuleOptions } from './glom-auth.type';
import { Inject, Logger, LoggerService } from '@nestjs/common';
import { GlomAuthService } from './glom-auth.service';

export const AUTH_ROLES = 'AUTH_ROLES';
const loggerType: Record<'New' | 'Failed' | 'Done', keyof LoggerService> = {
  New: 'log',
  Done: 'verbose',
  Failed: 'error',
};

export class GlomAuthSeeder {
  public seedItems: { item: string; status: keyof typeof loggerType }[] = [];
  constructor(
    prismaService: GlomPrismaService,
    @Inject(AUTH_ROLES) roles: GlomAuthModuleOptions['roles']
  ) {
    this.seedRoles(prismaService, roles).catch((error) =>
      Logger.error(error, GlomAuthService.name)
    );
  }

  private async seedRoles(
    prisma: GlomPrismaService,
    roles: GlomAuthModuleOptions['roles']
  ) {
    const count = await prisma.role.count();
    if (count === 0)
      await prisma.role.createMany({
        data: roles,
        skipDuplicates: true,
      });
  }

  getSeederStatus() {
    this.seedItems.forEach(({ item, status }) => {
      Logger[loggerType[status]](item, GlomAuthSeeder.name);
    });
  }
}
