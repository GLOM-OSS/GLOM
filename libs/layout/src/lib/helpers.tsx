import { IUser, UserRole } from "@squoolr/interfaces";

export const getUserRoles = (
  { annualConfigurator, annualRegistry, annualTeacher, annualStudent }: IUser,
  callingApp: 'admin' | 'personnel' | 'student'
): UserRole[] => {
  if (callingApp === 'student' && annualStudent) return ['student'];
  if (callingApp === 'admin') return ['administrator'];
  const newRoles: (UserRole | undefined)[] = [
    annualConfigurator ? 'secretary' : undefined,
    annualRegistry ? 'registry' : undefined,
    annualTeacher ? 'teacher' : undefined,
    annualTeacher?.classroomDivisions &&
    annualTeacher.classroomDivisions.length > 0
      ? 'coordinator'
      : undefined,
  ];
  const Roles: UserRole[] = newRoles.filter(
    (_) => _ !== undefined
  ) as UserRole[];

  return Roles.sort((a, b) => (a > b ? 1 : -1));
};
