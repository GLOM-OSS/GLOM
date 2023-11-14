import { SetMetadata } from '@nestjs/common';
import { MetadataEnum, Role } from '../../utils/enums';

export const IsPublic = () => SetMetadata(MetadataEnum.IS_PUBLIC, true);

export const IsPrivate = () => SetMetadata(MetadataEnum.IS_PRIVATE, true);

export const Roles = (...roles: Role[]) =>
  SetMetadata(MetadataEnum.ROLES, roles);
