import { Person, Prisma } from '@prisma/client';
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

export type GlomAuthModuleOptions = {
  /**
   * If set to `true`, this module will attempt to used glom's externally declared `prisma` and `mailer` modules.
   * This can be usefull if you globally imported these modules in your app root modules.
   */
  useGlobalDeps: boolean;
  /**
   * Application roles. This roles will  automatical seed into database
   * @example
   * const roles = [
   *  {origin: 'https://exemple.com', role_name: 'Client'},
   *  {origin: 'https://admin.exemple.com', role_name: 'Admin'},
   * ]
   */
  roles: Prisma.RoleCreateManyInput[];
};
