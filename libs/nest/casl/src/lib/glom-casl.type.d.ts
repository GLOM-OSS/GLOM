import { RequestMethod } from '@nestjs/common';
import { Model, PrismaQuery } from '@casl/prisma';
import { Person } from '@prisma/client';

type IResource<K extends string> = {
  subject: K;
  method: RequestMethod;
};

export type GlomAbilityConfig<T, K extends string> = {
  roleName?: string;
  ressources: IResource<K>[];
  criterials?: PrismaQuery<Model<T>>;
};
export type ActorModel = Record<string, unknown>;
export type GlomCaslModuleOptions<T extends ActorModel, K extends string> = {
  abilityConfigs: GlomAbilityConfig<T, K>[];
};
