import { RequestMethod } from '@nestjs/common';
import { Model, PrismaQuery } from '@casl/prisma';
import { Person } from '@prisma/client';

type IResource = {
  url: string | string[];
  method: RequestMethod;
};

export type GlomAbilityConfig<T> = {
  roleName?: string;
  ressources: IResource[];
  criterials?: PrismaQuery<Model<T>>;
};
export type PrismaModel = Record<string, unknown>;
export type GlomCaslModuleOptions<T extends PrismaModel> = {
  abilityConfigs: GlomAbilityConfig<T>[];
};
