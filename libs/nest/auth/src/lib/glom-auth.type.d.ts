import { Person, Prisma } from '@prisma/client';
import { Profile } from 'passport';

type OptionalPropertyOf<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T],
  undefined
>;

export type User = Person & {
  role_id: string;
  login_id: string;
};

export type AppRole<R> = {
  role_name: R;
  origin: string;
};

export type GlomAuthModuleOptions<R> = {
  /**
   * If set to `true`, this module will attempt to used glom's externally declared `prisma` and `mailer` modules.
   * This can be usefull if you globally imported these modules in your app root modules.
   */
  omitModuleDeps: boolean;
  /**
   * Application roles. This roles will  automatical seed into database
   * @example
   * const roles = [
   *  {origin: 'https://exemple.com', role_name: 'Client'},
   *  {origin: 'https://admin.exemple.com', role_name: 'Admin'},
   * ]
   */
  roles: AppRole<R>[];
  /**
   * Third parthy strategies you want this module to implement.
   * Local strategy does not require this option to be passed
   */
  strategies?: GlomStrategy[];
};

export type RoleCheckOptions = { roleId?: string; allowRoles?: string[] } & (
  | {
      roleId: string;
    }
  | { allowRoles: string[] }
);

export { Profile as GoogleProfile } from 'passport-google-oauth20';
export type GlomStrategy = 'google' | 'github' | 'facebook';
export type GlomStrategyProfile = {
  strategy: GlomStrategy;
  profile: Profile;
};

export type ThirdParthiesModuleOptions = Omit<
  GlomAuthModuleOptions,
  'useGlobalDeps'
>;
