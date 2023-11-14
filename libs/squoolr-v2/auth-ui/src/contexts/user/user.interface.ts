import { UserEntity, UserAnnualRoles } from '@glom/data-types/squoolr';

export type UserAction =
  | { type: 'LOAD_USER'; payload: UserEntity }
  | { type: 'CLEAR_USER' }
  | { type: 'UPDATE_ROLES'; payload: UserAnnualRoles };
export interface UserDispatchInterface {
  userDispatch: React.Dispatch<UserAction>;
}
export interface UserContextPayload extends UserDispatchInterface {
  data: UserEntity;
}
