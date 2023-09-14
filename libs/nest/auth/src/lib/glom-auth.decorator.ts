import { SetMetadata } from '@nestjs/common';

export enum MetadataEnum {
  ROLES = 'Roles',
  IS_PUBLIC = 'isPublic',
}

export const IsPublic = () => SetMetadata(MetadataEnum.IS_PUBLIC, true);

export const Roles = (...roles: string[]) =>
  SetMetadata(MetadataEnum.ROLES, roles);
