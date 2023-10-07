import { RequestMethod } from '@nestjs/common';
import { Model, PrismaQuery, Subjects } from '@casl/prisma';
import { Person, Prisma } from '@prisma/client';
import { ExtractSubjectType, PureAbility } from '@casl/ability';

export type GlomAppSubjects<
  T extends GlomAppActorModel,
  S extends string
> = Subjects<Record<S extends string ? S : string, T>>;
export type GlomAppActorModel = Record<string, unknown>;
export type GlomAppSubjectType = ExtractSubjectType<GlomAppSubjects<T, S>>;
export type AbilityCriterial<T extends GlomAppActorModel> = PrismaQuery<
  Model<T, Prisma.ModelName>
>;
export type GlomAppAbility<
  T extends GlomAppActorModel,
  S extends string
> = PureAbility<[Action, GlomAppSubjects<T, S>], AbilityCriterial<T>>;

export type GlomAppResource<K extends string> = {
  subject: K;
  method: RequestMethod;
};
export type GlomAbilityConfig<T, K extends string> = {
  roleName?: string;
  ressources: GlomAppResource<K>[];
  criterials?: AbilityCriterial<T>;
};
export type GlomCaslModuleOptions<
  T extends GlomAppActorModel,
  K extends string
> = {
  abilityConfigs: GlomAbilityConfig<T, K>[];
};
