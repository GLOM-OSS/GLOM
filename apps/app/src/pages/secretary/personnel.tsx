import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  addNewConfigurator,
  addNewCoordinator,
  addNewRegistry,
  addNewTeacher,
  editPersonnel,
  editTeacher,
  getConfigurators,
  getCoordinators,
  getPersonnel as getAllPersonnel,
  getRegistries,
  getTeachers,
  resetPassword,
  resetRegistryCode,
  resetTeacherCode,
  Personnel as PersonnelData,
} from '@squoolr/api-services';
import { theme } from '@squoolr/theme';
import {
  ErrorMessage,
  filterNotificationUsage,
  useNotification,
} from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { ClassroomInterface } from '../../components/secretary/classrooms';
import ActionBar from '../../components/secretary/personnel/actionBar';
import ConfirmResetDialog from '../../components/secretary/personnel/confirmResetDialog';
import NewCoordinatorDialog from '../../components/secretary/personnel/NewCoordinatorDialog';
import PersonnelRow, {
  PersonnelInterface,
} from '../../components/secretary/personnel/PersonnelRow';
import { PersonnelRowSkeleton } from '../../components/secretary/personnel/personnelRowSkeleton';
import PersonnelTabs, {
  TabItem,
} from '../../components/secretary/personnel/personnelTabs';
import StaffDialog, {
  StaffInterface,
} from '../../components/secretary/personnel/staffDialog';
import TeacherDialog, {
  TeacherInterface,
} from '../../components/secretary/personnel/teacherDialog';

export default function Personnel() {
  const { formatMessage } = useIntl();
  const [activeTabItem, setActiveTabItem] = useState<TabItem>('allPersonnel');
  const [searchValue, setSearchValue] = useState<string>('');
  const [isAddNewPersonnelDialogOpen, setIsAddNewPersonnelDialogOPen] =
    useState<boolean>(false);

  const [personnels, setPersonnels] = useState<PersonnelInterface[]>([]);
  const [arePersonnelLoading, setArePersonnelLoading] =
    useState<boolean>(false);
  const [showArchived, setShowArchived] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<
    {
      usage: string;
      notif: useNotification;
    }[]
  >([]);

  const getPersonnels = () => {
    setArePersonnelLoading(true);

    const notif = new useNotification();
    setNotifications(filterNotificationUsage('load', notif, notifications));
    const personnelHandler: Record<TabItem, () => Promise<PersonnelData[]>> = {
      allPersonnel: () => getAllPersonnel({ is_deleted: showArchived }),
      academicService: () => getRegistries({ is_deleted: showArchived }),
      coordinator: () => getCoordinators({ is_deleted: showArchived }),
      secretariat: () => getConfigurators({ is_deleted: showArchived }),
      teacher: () => getTeachers({ is_deleted: showArchived }),
    };
    personnelHandler[activeTabItem]()
      .then((personnel) => {
        setPersonnels(
          personnel.map(
            ({
              annual_teacher_id,
              annual_configurator_id,
              annual_registry_id,
              personnel_code,
              phone_number,
              first_name,
              email,
              last_connected,
              last_name,
              login_id,
              roles,
            }) => ({
              personnel_id: (annual_teacher_id ||
                annual_configurator_id ||
                annual_registry_id) as string,
              personnel_code,
              first_name,
              last_connected,
              last_name,
              email,
              login_id,
              is_academic_service: roles.includes('S.A.'),
              is_coordo: roles.includes('Co'),
              is_secretariat: roles.includes('Se'),
              is_teacher: roles.includes('Te'),
              phone_number: phone_number,
              is_archived: false,
            })
          )
        );
        setArePersonnelLoading(false);
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingPersonnel' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getPersonnels}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'failedToLoadPersonnel' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    getPersonnels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, activeTabItem, showArchived]);

  const [activePersonnel, setActivePersonnel] = useState<PersonnelInterface>();
  const [isProfileDialogOpen, setIsProfileDialogOpen] =
    useState<boolean>(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState<boolean>(false);
  const [isResetCodeDialogOpen, setIsResetCodeDialogOpen] =
    useState<boolean>(false);
  const [isSubmittingMenuAction, setIsSubmittingMenuAction] =
    useState<boolean>(false);

  const confirmReset = (usage: 'password' | 'code') => {
    const notif = new useNotification();
    setIsSubmittingMenuAction(true);
    setNotifications(filterNotificationUsage('reset', notif, notifications));
    switch (usage) {
      case 'password': {
        notif.notify({ render: formatMessage({ id: 'resettingPassword' }) });
        resetPassword(activePersonnel?.email as string)
          .then(() => {
            notif.update({
              render: formatMessage({ id: 'resetPasswordSuccessful' }),
            });
            setActivePersonnel(undefined);
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() => confirmReset(usage)}
                  notification={notif}
                  message={
                    error?.message ||
                    formatMessage({ id: 'failedToResetPassword' })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          })
          .finally(() => setIsSubmittingMenuAction(false));
        break;
      }
      case 'code': {
        notif.notify({ render: formatMessage({ id: 'resettingCode' }) });
        if (activePersonnel?.is_academic_service) {
          resetRegistryCode(activePersonnel.personnel_id)
            .then(() => {
              notif.update({
                render: formatMessage({ id: 'resetCodeSuccessful' }),
              });
            })
            .catch((error) => {
              notif.update({
                type: 'ERROR',
                render: (
                  <ErrorMessage
                    retryFunction={() => confirmReset(usage)}
                    notification={notif}
                    message={
                      error?.message ||
                      formatMessage({ id: 'failedToResetCode' })
                    }
                  />
                ),
                autoClose: false,
                icon: () => <ReportRounded fontSize="medium" color="error" />,
              });
            })
            .finally(() => setIsSubmittingMenuAction(false));
        } else if (activePersonnel?.is_teacher || activePersonnel?.is_coordo) {
          resetTeacherCode(activePersonnel.personnel_id)
            .then(() => {
              notif.update({
                render: formatMessage({ id: 'resetCodeSuccessful' }),
              });
            })
            .catch((error) => {
              notif.update({
                type: 'ERROR',
                render: (
                  <ErrorMessage
                    retryFunction={() => confirmReset(usage)}
                    notification={notif}
                    message={
                      error?.message ||
                      formatMessage({ id: 'failedToResetCode' })
                    }
                  />
                ),
                autoClose: false,
                icon: () => <ReportRounded fontSize="medium" color="error" />,
              });
            })
            .finally(() => setIsSubmittingMenuAction(false));
        }
      }
    }
  };

  const [isSubmittingActionBarAction, setIsSubmitActionBarAction] =
    useState<boolean>(false);
  const createCoordinator = (submitData: {
    selectedTeacherId: string;
    selectedClassrooms: ClassroomInterface[];
  }) => {
    const { selectedClassrooms, selectedTeacherId } = submitData;
    const selectedClassroomCodes = selectedClassrooms.map(
      ({ classroom_code }) => classroom_code
    );
    const notif = new useNotification();
    notif.notify({ render: formatMessage({ id: 'addingCoordinator' }) });
    setNotifications(
      filterNotificationUsage('createStaff', notif, notifications)
    );
    setIsSubmitActionBarAction(true);
    addNewCoordinator(selectedTeacherId, selectedClassroomCodes)
      .then(() => {
        notif.update({ render: formatMessage({ id: 'addedCoordinator' }) });
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createCoordinator(submitData)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'failedToAddCoordinator' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitActionBarAction(false));
  };

  const createStaff = (values: StaffInterface, usage: 'edit' | 'create') => {
    const notif = new useNotification();
    const { personnel_code, is_archived, login_id, ...newValues } = values;
    switch (usage) {
      case 'create': {
        notif.notify({
          render: formatMessage({
            id: `adding${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
              1,
              undefined
            )}`,
          }),
        });
        setNotifications(
          filterNotificationUsage('addStaff', notif, notifications)
        );
        setIsSubmitActionBarAction(true);
        if (activeTabItem === 'secretariat') {
          addNewConfigurator(newValues)
            .then(() => {
              notif.update({
                render: formatMessage({
                  id: `added${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
                    1,
                    undefined
                  )}`,
                }),
              });
            })
            .catch((error) => {
              notif.update({
                type: 'ERROR',
                render: (
                  <ErrorMessage
                    retryFunction={() => createStaff(values, usage)}
                    notification={notif}
                    message={
                      error?.message ||
                      formatMessage({ id: 'failedToAddStaff' })
                    }
                  />
                ),
                autoClose: false,
                icon: () => <ReportRounded fontSize="medium" color="error" />,
              });
            })
            .finally(() => setIsSubmitActionBarAction(false));
        } else if (activeTabItem === 'academicService') {
          addNewRegistry(newValues)
            .then(() => {
              notif.update({
                render: formatMessage({
                  id: `added${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
                    1,
                    undefined
                  )}`,
                }),
              });
            })
            .catch((error) => {
              notif.update({
                type: 'ERROR',
                render: (
                  <ErrorMessage
                    retryFunction={() => createStaff(values, usage)}
                    notification={notif}
                    message={
                      error?.message ||
                      formatMessage({ id: 'failedToAddStaff' })
                    }
                  />
                ),
                autoClose: false,
                icon: () => <ReportRounded fontSize="medium" color="error" />,
              });
            })
            .finally(() => setIsSubmitActionBarAction(false));
        }
        break;
      }
      case 'edit': {
        notif.notify({
          render: formatMessage({
            id: `saving${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
              1,
              undefined
            )}`,
          }),
        });
        setNotifications(
          filterNotificationUsage('saveStaff', notif, notifications)
        );
        setIsSubmitActionBarAction(true);
        editPersonnel(values.login_id, newValues)
          .then(() => {
            notif.update({
              render: formatMessage({
                id: `saved${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
                  1,
                  undefined
                )}`,
              }),
            });
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() => createStaff(values, usage)}
                  notification={notif}
                  message={
                    error?.message || formatMessage({ id: 'failedToSaveStaff' })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          })
          .finally(() => setIsSubmitActionBarAction(false));
        break;
      }
    }
  };
  const createTeacher = (
    values: TeacherInterface,
    usage: 'edit' | 'create'
  ) => {
    const notif = new useNotification();
    const { personnel_code, is_archived, hourly_rate, ...person } = values;
    const newValues = { hourly_rate: Number(hourly_rate), ...person };
    switch (usage) {
      case 'create': {
        notif.notify({
          render: formatMessage({
            id: `adding${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
              1,
              undefined
            )}`,
          }),
        });
        setNotifications(
          filterNotificationUsage('addStaff', notif, notifications)
        );
        setIsSubmitActionBarAction(true);
        addNewTeacher(newValues)
          .then(() => {
            notif.update({
              render: formatMessage({
                id: `added${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
                  1,
                  undefined
                )}`,
              }),
            });
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() => createTeacher(values, usage)}
                  notification={notif}
                  message={
                    error?.message ||
                    formatMessage({ id: 'failedToAddTeacher' })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          })
          .finally(() => setIsSubmitActionBarAction(false));
        break;
      }
      case 'edit': {
        notif.notify({
          render: formatMessage({
            id: `saving${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
              1,
              undefined
            )}`,
          }),
        });
        setNotifications(
          filterNotificationUsage('saveStaff', notif, notifications)
        );
        setIsSubmitActionBarAction(true);

        editTeacher(values.personnel_code, newValues)
          .then(() => {
            notif.update({
              render: formatMessage({
                id: `saved${activeTabItem[0].toUpperCase()}${activeTabItem.slice(
                  1,
                  undefined
                )}`,
              }),
            });
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() => createTeacher(values, usage)}
                  notification={notif}
                  message={
                    error?.message ||
                    formatMessage({ id: 'failedToSaveTeacher' })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          })
          .finally(() => setIsSubmitActionBarAction(false));
        break;
      }
    }
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <>
      {isAddNewPersonnelDialogOpen && activeTabItem === 'coordinator' && (
        <NewCoordinatorDialog
          close={() => setIsAddNewPersonnelDialogOPen(false)}
          handleConfirm={createCoordinator}
          isDialogOpen={
            isAddNewPersonnelDialogOpen && activeTabItem === 'coordinator'
          }
        />
      )}
      {((isProfileDialogOpen &&
        activePersonnel !== undefined &&
        !activePersonnel.is_teacher) ||
        (isAddNewPersonnelDialogOpen &&
          ['allPersonnel', 'secretariat', 'academicService'].includes(
            activeTabItem
          ))) && (
        <StaffDialog
          close={() => {
            setActivePersonnel(undefined);
            setIsEditing(false);
            setIsProfileDialogOpen(false);
            setIsAddNewPersonnelDialogOPen(false);
          }}
          setIsEditing={setIsEditing}
          handleConfirm={createStaff}
          isEditDialog={isEditing}
          activePersonnel={activePersonnel as StaffInterface | undefined}
          isDialogOpen={
            (isProfileDialogOpen &&
              activePersonnel !== undefined &&
              !activePersonnel.is_teacher) ||
            (isAddNewPersonnelDialogOpen &&
              ['allPersonnel', 'secretariat', 'academicService'].includes(
                activeTabItem
              ))
          }
        />
      )}
      {((isProfileDialogOpen &&
        activePersonnel !== undefined &&
        activePersonnel.is_teacher) ||
        (isAddNewPersonnelDialogOpen && activeTabItem === 'teacher')) && (
        <TeacherDialog
          close={() => {
            setActivePersonnel(undefined);
            setIsEditing(false);
            setIsProfileDialogOpen(false);
            setIsAddNewPersonnelDialogOPen(false);
          }}
          setIsEditing={setIsEditing}
          handleConfirm={createTeacher}
          isEditDialog={isEditing}
          activePersonnel={activePersonnel as StaffInterface | undefined}
          isDialogOpen={
            (isProfileDialogOpen &&
              activePersonnel !== undefined &&
              activePersonnel.is_teacher) ||
            (isAddNewPersonnelDialogOpen && activeTabItem === 'teacher')
          }
        />
      )}
      {activePersonnel && (
        <ConfirmResetDialog
          close={() => {
            setIsResetCodeDialogOpen(false);
            setIsResetPasswordDialogOpen(false);
          }}
          handleConfirm={() =>
            confirmReset(isResetCodeDialogOpen ? 'code' : 'password')
          }
          isResetCodeDialogOpen={isResetCodeDialogOpen}
          isResetPasswordDialogOpen={isResetPasswordDialogOpen}
          personnel_code={activePersonnel.personnel_code}
        />
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          height: '100%',
          gap: theme.spacing(3),
        }}
      >
        <PersonnelTabs setActiveTabItem={setActiveTabItem} />
        <ActionBar
          archived={{ showArchived, setShowArchived }}
          activeTabItem={activeTabItem}
          search={{ searchValue, setSearchValue }}
          isSubmittingActionBarAction={isSubmittingActionBarAction}
          handleAddClick={() =>
            isAddNewPersonnelDialogOpen
              ? null
              : setIsAddNewPersonnelDialogOPen(true)
          }
        />
        <Scrollbars>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{ backgroundColor: lighten(theme.palette.primary.main, 0.8) }}
            >
              <TableRow>
                {[
                  'personnelName',
                  'email',
                  'phone_number',
                  'lastConnect',
                  'role',
                ].map((value, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      ...theme.typography.body1,
                      color: theme.common.body,
                      fontWeight: 300,
                    }}
                  >
                    {formatMessage({ id: value })}
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {arePersonnelLoading &&
                [...new Array(10)].map((_, index) => (
                  <PersonnelRowSkeleton index={index} key={index} />
                ))}
              {!arePersonnelLoading && personnels.length === 0 && (
                <TableRow>
                  <TableCell
                    component="th"
                    sx={{ textAlign: 'center' }}
                    scope="row"
                    colSpan={6}
                  >
                    {formatMessage({
                      id:
                        activeTabItem === 'coordinator'
                          ? 'noCoordinator'
                          : activeTabItem === 'teacher'
                          ? 'noTeacher'
                          : 'noSchoolPersonnel',
                    })}
                  </TableCell>
                </TableRow>
              )}
              {!arePersonnelLoading &&
                personnels
                  .sort((a, b) => (a.is_archived < b.is_archived ? -1 : 1))
                  .map((personnel, index) => (
                    <PersonnelRow
                      isSubmitting={isSubmittingMenuAction}
                      index={index}
                      personnel={personnel}
                      isActive={
                        isSubmittingMenuAction &&
                        activePersonnel?.personnel_code ===
                          personnel.personnel_code
                      }
                      key={index}
                      openEditDialog={(personnel: PersonnelInterface) => {
                        setActivePersonnel(personnel);
                        setIsEditing(true);
                        setIsProfileDialogOpen(true);
                      }}
                      openProfileDialog={(personnel: PersonnelInterface) => {
                        setActivePersonnel(personnel);
                        setIsProfileDialogOpen(true);
                      }}
                      openResetPasswordDialog={(
                        personnel: PersonnelInterface
                      ) => {
                        setActivePersonnel(personnel);
                        setIsResetPasswordDialogOpen(true);
                      }}
                      openResetCodeDialog={(personnel: PersonnelInterface) => {
                        setActivePersonnel(personnel);
                        setIsResetCodeDialogOpen(true);
                      }}
                    />
                  ))}
            </TableBody>
          </Table>
        </Scrollbars>
      </Box>
    </>
  );
}
