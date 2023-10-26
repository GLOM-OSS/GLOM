import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  REGISTRY = 'REGISTRY',
  COORDINATOR = 'COORDINATOR',
  CONFIGURATOR = 'CONFIGURATOR',
}

export enum MetadataEnum {
  ROLES = 'roles',
  IS_PUBLIC = 'isPublic',
  IS_PRIVATE = 'isPrivate',
}

export const IsPublic = () => SetMetadata(MetadataEnum.IS_PUBLIC, true);

export const IsPrivate = () => SetMetadata(MetadataEnum.IS_PRIVATE, true);

export const Roles = (...roles: Role[]) =>
  SetMetadata(MetadataEnum.ROLES, roles);
