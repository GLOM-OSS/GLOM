import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Inject, Injectable, RequestMethod } from '@nestjs/common';
import { GlomAbilityConfig, PrismaModel } from './glom-casl.type';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
export type AppSubjects<T extends PrismaModel> = Subjects<
  Partial<Record<string, T>>
>;
export type AppAbility<T extends PrismaModel> = PureAbility<
  [Action, AppSubjects<T>],
  PrismaQuery<T>
>;

export const GLOM_ABILITIES = 'GLOM_ABILITIES';
export const methodActions: Record<RequestMethod, Action> = {
  [RequestMethod.ALL]: Action.Manage,
  [RequestMethod.GET]: Action.Read,
  [RequestMethod.HEAD]: Action.Read,
  [RequestMethod.OPTIONS]: Action.Read,
  [RequestMethod.POST]: Action.Create,
  [RequestMethod.PUT]: Action.Update,
  [RequestMethod.PATCH]: Action.Update,
  [RequestMethod.DELETE]: Action.Delete,
};

@Injectable()
export class GlomCaslAbilityFactory<T extends PrismaModel> {
  constructor(
    @Inject(GLOM_ABILITIES)
    private readonly glomAbilities: GlomAbilityConfig<T>[]
  ) {}
  createForUser(user: Partial<T & { roles: string[] }>) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility<T>>(
      createPrismaAbility
    );
    this.glomAbilities.forEach(({ ressources, criterials, roleName }) => {
      const isUserAble = Object.keys(criterials ?? {}).reduce((isAble, key) => {
        return isAble && user[key] === criterials[key];
      }, true);
      if (
        isUserAble &&
        (!roleName || (roleName && user['roles']?.includes(roleName)))
      ) {
        ressources.forEach(({ method, url }) => {
          can(methodActions[method], url);
        });
      }
    });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<AppSubjects<T>>,
    });
  }
}
