import { RequestMethod } from '@nestjs/common';
import { Model, PrismaQuery, Subjects } from '@casl/prisma';
import { Person } from '@prisma/client';
import { ExtractSubjectType, PureAbility } from '@casl/ability';

export type GlomAppSubjects<
  T extends GlomAppActorModel,
  S extends string
> = Subjects<Record<S extends string ? S : string, T>>;
export type GlomAppActorModel = Record<string, unknown>;
export type GlomAppSubjectType = ExtractSubjectType<GlomAppSubjects<T, S>>;
export type GlomAppAbility<
  T extends GlomAppActorModel,
  S extends string
> = PureAbility<[Action, GlomAppSubjects<T, S>], PrismaQuery<T>>;

export type GlomAppResource<K extends string> = {
  subject: K;
  method: RequestMethod;
};

export type GlomAbilityConfig<T, K extends string> = {
  roleName?: string;
  ressources: GlomAppResource<K>[];
  criterials?: PrismaQuery<Model<T>>;
};
export type GlomCaslModuleOptions<
  T extends GlomAppActorModel,
  K extends string
> = {
  abilityConfigs: GlomAbilityConfig<T, K>[];
};
