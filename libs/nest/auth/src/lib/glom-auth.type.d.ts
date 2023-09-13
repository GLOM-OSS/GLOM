import { Person } from '@prisma/client';
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

