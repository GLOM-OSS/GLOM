import { SetMetadata } from '@nestjs/common';
import { Role } from '../utils/types';

export enum MetadataEnum {
  ROLES = 'roles',
  IS_PUBLIC = 'isPublic',
  IS_PRIVATE = 'isPrivate',
}

export const IsPublic = () => SetMetadata(MetadataEnum.IS_PUBLIC, true);

export const IsPrivate = () => SetMetadata(MetadataEnum.IS_PRIVATE, true);

export const Roles = (...roles: Role[]) =>
  SetMetadata(MetadataEnum.ROLES, roles);
