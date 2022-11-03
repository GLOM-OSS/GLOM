import { SetMetadata } from '@nestjs/common';
import { Role } from '../utils/types';

export const IsPublic = () => SetMetadata('isPublic', true);

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

