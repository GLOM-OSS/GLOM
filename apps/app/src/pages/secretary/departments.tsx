import { AddRounded, ReportRounded, SearchRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Fab,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  createDepartment,
  createMajor,
  Department,
  editDepartment,
  editMajor,
  getDepartments,
  getMajors,
} from '@squoolr/api-services';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import AcademicItem, { AcademicItemSkeleton } from '../../AcademicItem';
import ConfirmArchiveDialog from '../../components/secretary/confirmArchiveDialog';
import ConfirmEditDialog from '../../components/secretary/confirmEditDepartmentDialog';
import MajorDialog, {
  FeeSetting,
  MajorInterface,
} from '../../components/secretary/majorDialog';
import NewDepartmentDialog, {
  newDepartmentInterface,
} from '../../components/secretary/newDepartmentDialog';

export interface DepartmentInterface {
  created_at: Date;
  is_archived: boolean;
  deleted_at?: Date;
  item_code: string;
  item_name: string;
  item_acronym: string;
  department_acronym?: string;
  cycle_name?: 'BACHELORS' | 'MASTER' | 'DOCTORATE' | 'DUT' | 'BTS' | 'DTS';
}

export default function Departments({
  usage,
}: {
  usage: 'department' | 'major';
}) {
  const { formatMessage } = useIntl();
  const [activeAcademicItem, setActiveItem] = useState<DepartmentInterface>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] =
    useState<boolean>(false);
  const [academicItems, setAcademicItems] = useState<DepartmentInterface[]>([]);
  const [areAcademicItemsLoading, setAreAcademicItemsLoading] =
    useState<boolean>(true);

  const [notifications, setNotifications] = useState<useNotification[]>();
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [canSearch, setCanSearch] = useState<boolean>(false);

  const getAcademicItems = () => {
    setAreAcademicItemsLoading(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (notifications) setNotifications([...notifications, notif]);
    else setNotifications([notif]);
    switch (usage) {
      case 'department': {
        const departmentItemQuery = showArchived
          ? {
              keywords: searchTerm,
            }
          : { keywords: searchTerm, is_deleted: showArchived };
        getDepartments(departmentItemQuery)
          .then((departments) => {
            setAcademicItems(
              departments.map(
                ({
                  department_name,
                  department_acronym,
                  department_code,
                  created_at,
                  is_deleted,
                }) => ({
                  created_at,
                  item_acronym: department_acronym,
                  item_name: department_name,
                  is_archived: is_deleted,
                  item_code: department_code,
                })
              )
            );
            setAreAcademicItemsLoading(false);
            notif.dismiss();
            setNotifications([]);
            setCanSearch(true);
          })
          .catch((error) => {
            notif.notify({
              render: formatMessage({
                id: `loading${usage[0].toUpperCase()}${usage.slice(
                  1,
                  undefined
                )}s`,
              }),
            });
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={getAcademicItems}
                  notification={notif}
                  message={
                    error?.message ||
                    formatMessage({ id: 'getDepartmentsFailed' })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          });
        break;
      }
      case 'major': {
        const majorItemQuery = showArchived
          ? {
              department_code: selectedDepartmentCode as string,
            }
          : {
              department_code: selectedDepartmentCode as string,
              is_deleted: showArchived ?? undefined,
            };
        getMajors(majorItemQuery)
          .then((majors) => {
            setAcademicItems(
              majors.map(
                ({
                  major_name,
                  major_acronym,
                  major_code,
                  created_at,
                  is_deleted,
                  cycle_name,
                  department_acronym,
                }) => ({
                  created_at,
                  cycle_name,
                  department_acronym,
                  item_name: major_name,
                  item_code: major_code,
                  is_archived: is_deleted,
                  item_acronym: major_acronym,
                })
              )
            );
            setAreAcademicItemsLoading(false);
            notif.dismiss();
            setNotifications([]);
          })
          .catch((error) => {
            notif.notify({
              render: formatMessage({
                id: `loading${usage[0].toUpperCase()}${usage.slice(
                  1,
                  undefined
                )}s`,
              }),
            });
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={getAcademicItems}
                  notification={notif}
                  message={
                    error?.message ||
                    formatMessage({
                      id: `get${usage[0].toUpperCase()}${usage.slice(
                        1,
                        undefined
                      )}sFailed`,
                    })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          });
        break;
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    getAcademicItems();
    // alert('make it rain');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived, searchTerm, selectedDepartmentCode]);

  const [isAddNewAcademicItemDialogOpen, setIsAddNewAcademicItemDialogOpen] =
    useState<boolean>(false);

  const [isManagingDepartment, setIsManagingDepartment] =
    useState<boolean>(false);
  const [managementNotifications, setManagementNotifications] = useState<
    useNotification[]
  >([]);

  const createNewDepartment = (newDepartment: newDepartmentInterface) => {
    setIsManagingDepartment(true);
    managementNotifications.forEach((_) => _.dismiss());
    const notif = new useNotification();
    setManagementNotifications([...managementNotifications, notif]);
    notif.notify({
      render: formatMessage({
        id: activeAcademicItem ? 'editingDepartment' : 'creatingDepartment',
      }),
    });
    if (activeAcademicItem) {
      editDepartment(activeAcademicItem.item_code, {
        department_name: newDepartment.item_name,
      })
        .then(() => {
          notif.update({
            render: formatMessage({ id: 'departmentEditedSuccessfully' }),
          });
          setAcademicItems(
            academicItems.map((academicItem) =>
              academicItem.item_code === activeAcademicItem.item_code
                ? { ...academicItem, ...newDepartment }
                : academicItem
            )
          );
          setActiveItem(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => createNewDepartment(newDepartment)}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'failedToEditDepartment' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsManagingDepartment(false));
    } else {
      createDepartment({
        department_acronym: newDepartment.item_acronym,
        department_name: newDepartment.item_name,
      })
        .then(
          ({
            department_name,
            department_acronym,
            department_code,
            created_at,
            is_deleted,
          }) => {
            notif.update({
              render: formatMessage({ id: 'departmentCreatedSuccessfully' }),
            });
            setAcademicItems([
              ...academicItems,
              {
                created_at,
                item_acronym: department_acronym,
                item_name: department_name,
                is_archived: is_deleted,
                item_code: department_code,
              },
            ]);
          }
        )
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => createNewDepartment(newDepartment)}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'failedToCreateDepartment' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsManagingDepartment(false));
    }
  };

  const manageMajor = (majorValue: {
    values: MajorInterface;
    levelFees: FeeSetting[];
  }) => {
    managementNotifications.forEach((_) => _.dismiss());
    const notif = new useNotification();
    setManagementNotifications([...managementNotifications, notif]);
    notif.notify({
      render: formatMessage({
        id: activeAcademicItem ? 'editingMajor' : 'creatingMajor',
      }),
    });
    const {
      values: { item_acronym, cycle_id, department_code, item_name },
      levelFees,
    } = majorValue;
    if (activeAcademicItem) {
      editMajor(activeAcademicItem.item_code, {
        major_name: item_name,
        department_code: department_code,
        major_acronym: item_acronym,
        classrooms: levelFees,
      })
        .then(() => {
          notif.update({
            render: formatMessage({ id: 'majorEditedSuccessfully' }),
          });
          setSelectedDepartmentCode(department_code);
          setAcademicItems(
            academicItems.map((academicItem) =>
              academicItem.item_code === activeAcademicItem.item_code
                ? { ...academicItem, ...majorValue.values }
                : academicItem
            )
          );
          setActiveItem(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageMajor(majorValue)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'failedToEditMajor' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    } else {
      createMajor({
        major_name: item_name,
        cycle_id: cycle_id,
        department_code: department_code,
        major_acronym: item_acronym,
        classrooms: levelFees,
      })
        .then(
          ({
            created_at,
            cycle_name,
            is_deleted,
            major_code,
            major_name,
            major_acronym,
            department_acronym,
          }) => {
            notif.update({
              render: formatMessage({ id: 'majorCreatedSuccessfully' }),
            });
            setSelectedDepartmentCode(department_code);
            setAcademicItems([
              ...academicItems,
              {
                created_at,
                cycle_name,
                department_acronym,
                item_name: major_name,
                item_code: major_code,
                is_archived: is_deleted,
                item_acronym: major_acronym,
              },
            ]);
          }
        )
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageMajor(majorValue)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'failedToCreateMajor' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    }
    setIsManagingDepartment(false);
  };

  const [isWarningDialogOpen, setIsWarningDialogOpen] =
    useState<boolean>(false);
  const [isArchiving, setIsArchiving] = useState<boolean>(false);

  const unArchiveItem = () => {
    setIsArchiving(true);
    managementNotifications.forEach((_) => _.dismiss());
    const notif = new useNotification();
    setManagementNotifications([...managementNotifications, notif]);
    notif.notify({
      render: formatMessage({
        id: activeAcademicItem?.is_archived ? 'unarchiving' : 'archiving',
      }),
    });
    setIsArchiving(false);
    switch (usage) {
      case 'department': {
        editDepartment(activeAcademicItem?.item_code as string, {
          is_deleted: !activeAcademicItem?.is_archived,
        })
          .then(() => {
            notif.update({
              render: activeAcademicItem?.is_archived
                ? formatMessage({
                    id: 'unarchivingSuccessfull',
                  })
                : formatMessage({
                    id: 'archivingSuccessfull',
                  }),
            });
            setAcademicItems(
              showArchived
                ? academicItems.map((academicItem) => {
                    if (
                      academicItem.item_code === activeAcademicItem?.item_code
                    )
                      return {
                        ...academicItem,
                        is_archived: !activeAcademicItem?.is_archived,
                      };
                    else return academicItem;
                  })
                : academicItems.filter(
                    ({ item_code }) =>
                      item_code !== activeAcademicItem?.item_code
                  )
            );
            setActiveItem(undefined);
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={unArchiveItem}
                  notification={notif}
                  message={
                    error?.message || activeAcademicItem?.is_archived
                      ? formatMessage({
                          id: 'failedToUnarchive',
                        })
                      : formatMessage({
                          id: 'failedToArchive',
                        })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          });
        break;
      }
      case 'major': {
        editMajor(activeAcademicItem?.item_code as string, {
          is_deleted: !activeAcademicItem?.is_archived,
        })
          .then(() => {
            notif.update({
              render: activeAcademicItem?.is_archived
                ? formatMessage({
                    id: 'unarchivingSuccessfull',
                  })
                : formatMessage({
                    id: 'archivingSuccessfull',
                  }),
            });
            setAcademicItems(
              showArchived
                ? academicItems.map((academicItem) => {
                    if (
                      academicItem.item_code === activeAcademicItem?.item_code
                    )
                      return {
                        ...academicItem,
                        is_archived: !activeAcademicItem?.is_archived,
                      };
                    else return academicItem;
                  })
                : academicItems.filter(
                    ({ item_code }) =>
                      item_code !== activeAcademicItem?.item_code
                  )
            );
            setActiveItem(undefined);
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={unArchiveItem}
                  notification={notif}
                  message={
                    error?.message || activeAcademicItem?.is_archived
                      ? formatMessage({
                          id: 'failedToUnarchive',
                        })
                      : formatMessage({
                          id: 'failedToArchive',
                        })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          });
        break;
      }
    }
  };

  const addNewItem = () => {
    switch (usage) {
      case 'department': {
        setIsAddNewAcademicItemDialogOpen(true);
        break;
      }
      case 'major': {
        setIsAddMajorDialogOpen(true);
        break;
      }
    }
  };

  const [isAddMajorDialogOpen, setIsAddMajorDialogOpen] =
    useState<boolean>(false);

  const [areDepartmentsLoading, setAreDepartmentsLoading] =
    useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [departmentNotif, setDepartmentNotif] = useState<useNotification>();
  const loadDepartments = () => {
    if (usage === 'major') {
      setAreDepartmentsLoading(true);
      const notif = new useNotification();
      if (departmentNotif) departmentNotif.dismiss();
      setDepartmentNotif(notif);
      getDepartments()
        .then((newDepartments) => {
          setDepartments(newDepartments);
          setAreDepartmentsLoading(false);
          notif.dismiss();
          setDepartmentNotif(undefined);
        })
        .catch((error) => {
          notif.notify({ render: formatMessage({ id: 'loadingDepartments' }) });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadDepartments}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'getDepartmentsFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    }
  };
  useEffect(() => {
    loadDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usage]);

  return (
    <>
      <MajorDialog
        closeDialog={() => {
          if (isEditDialogOpen) setIsEditDialogOpen(false);
          else setIsAddMajorDialogOpen(false);
        }}
        editableMajorCode={
          isEditDialogOpen ? activeAcademicItem?.item_code : undefined
        }
        handleSubmit={manageMajor}
        isDialogOpen={
          (isAddMajorDialogOpen || isEditDialogOpen) && usage === 'major'
        }
      />
      <ConfirmArchiveDialog
        isDialogOpen={isArchiveDialogOpen}
        closeDialog={() => setIsArchiveDialogOpen(false)}
        confirm={unArchiveItem}
        context={activeAcademicItem?.is_archived ? 'unarchive' : 'archive'}
      />
      <NewDepartmentDialog
        closeDialog={() => {
          if (isEditDialogOpen) setIsEditDialogOpen(false);
          else setIsAddNewAcademicItemDialogOpen(false);
        }}
        isDialogOpen={
          (isAddNewAcademicItemDialogOpen || isEditDialogOpen) &&
          usage === 'department'
        }
        handleSubmit={createNewDepartment}
        editableDepartment={isEditDialogOpen ? activeAcademicItem : undefined}
      />
      <ConfirmEditDialog
        usage={usage}
        isDialogOpen={isWarningDialogOpen}
        closeDialog={() => {
          setIsWarningDialogOpen(false);
        }}
        confirmEdit={() => setIsEditDialogOpen(true)}
        createNewAcademicItem={() => {
          setActiveItem(undefined);
          addNewItem();
        }}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: theme.spacing(3),
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              usage === 'major' ? 'auto auto 1fr' : 'auto 1fr',
            columnGap: theme.spacing(2),
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder={formatMessage({
              id: `search${usage[0].toUpperCase()}${usage.slice(
                1,
                undefined
              )}Name`,
            })}
            variant="outlined"
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
            size="small"
            sx={{
              '& input': { ...theme.typography.caption },
              backgroundColor: theme.common.inputBackground,
            }}
            disabled={areAcademicItemsLoading && canSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded
                    sx={{ fontSize: 25, color: theme.common.placeholder }}
                  />
                </InputAdornment>
              ),
            }}
          />
          {usage === 'major' && (
            <TextField
              select
              size="small"
              placeholder={formatMessage({ id: 'department' })}
              label={formatMessage({ id: 'searchDepartment' })}
              value={selectedDepartmentCode}
              onChange={(event) => {
                const selectedDepartmentCode = event.target.value;
                setSelectedDepartmentCode(
                  selectedDepartmentCode !== 'all'
                    ? selectedDepartmentCode
                    : undefined
                );
              }}
              sx={{
                '& input': { ...theme.typography.caption },
                backgroundColor: theme.common.inputBackground,
                minWidth: '200px',
              }}
              color="primary"
              disabled={
                areDepartmentsLoading || (areAcademicItemsLoading && canSearch)
              }
            >
              <MenuItem value={'all'}>{formatMessage({ id: 'all' })}</MenuItem>
              {departments.map(
                (
                  { department_acronym, department_code, department_name },
                  index
                ) => (
                  <MenuItem
                    key={index}
                    value={department_code}
                  >{`${department_name}(${department_acronym})`}</MenuItem>
                )
              )}
            </TextField>
          )}
          <FormControlLabel
            control={
              <Checkbox
                disabled={areAcademicItemsLoading && canSearch}
                checked={showArchived}
                color="primary"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setShowArchived(event.target.checked)
                }
              />
            }
            label={formatMessage({ id: 'showArchived' })}
            sx={{ '& .MuiTypography-root': { ...theme.typography.body2 } }}
          />
        </Box>
        <Box sx={{ height: '100%', position: 'relative' }}>
          {!areAcademicItemsLoading && (
            <Fab
              disabled={
                areAcademicItemsLoading || isAddNewAcademicItemDialogOpen
              }
              onClick={addNewItem}
              color="primary"
              sx={{ position: 'absolute', bottom: 16, right: 24 }}
            >
              <Tooltip
                arrow
                title={formatMessage({
                  id: `new${usage[0].toUpperCase()}${usage.slice(
                    1,
                    undefined
                  )}`,
                })}
              >
                <AddRounded />
              </Tooltip>
            </Fab>
          )}
          <Scrollbars>
            <Box
              sx={{
                display: 'grid',
                justifyContent: 'center',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: theme.spacing(2),
              }}
            >
              {areAcademicItemsLoading &&
                [...new Array(10)].map((_, index) => (
                  <AcademicItemSkeleton
                    key={index}
                    hasChips={usage !== 'department'}
                  />
                ))}
              {!areAcademicItemsLoading && academicItems.length === 0 && (
                <Box
                  component={Button}
                  onClick={addNewItem}
                  sx={{
                    display: 'grid',
                    alignItems: 'center',
                    justifyItems: 'center',
                    border: `1px solid ${theme.common.placeholder}`,
                    borderRadius: '10px',
                    padding: theme.spacing(5),
                  }}
                >
                  <AddRounded
                    sx={{ fontSize: '45px', color: theme.common.placeholder }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 300,
                      color: theme.common.titleActive,
                      marginTop: theme.spacing(1),
                    }}
                  >
                    {formatMessage({
                      id: `addNew${usage[0].toUpperCase()}${usage.slice(
                        1,
                        undefined
                      )}`,
                    })}
                  </Typography>
                </Box>
              )}
              {!areAcademicItemsLoading &&
                academicItems.length > 0 &&
                academicItems
                  .sort((a, b) =>
                    new Date(a.created_at) > new Date(b.created_at) ? -1 : 1
                  )
                  .map((item, index) => {
                    const {
                      created_at,
                      is_archived,
                      deleted_at,
                      item_acronym,
                      item_name,
                      cycle_name,
                      department_acronym,
                      item_code,
                    } = item;
                    const displayItem = {
                      created_at,
                      is_archived,
                      deleted_at,
                      item_acronym,
                      item_name,
                      item_code,
                    };
                    return (
                      <AcademicItem
                        usage={usage}
                        disableMenu={isManagingDepartment || isArchiving}
                        chipItems={
                          usage === 'department'
                            ? []
                            : [
                                department_acronym as string,
                                formatMessage({ id: cycle_name }),
                              ]
                        }
                        key={index}
                        handleEditClick={() => {
                          setActiveItem(item);
                          setIsWarningDialogOpen(true);
                        }}
                        handleArchiveClick={() => {
                          setActiveItem(item);
                          setIsArchiveDialogOpen(true);
                        }}
                        handleUnarchiveClick={() => {
                          setActiveItem(item);
                          setIsArchiveDialogOpen(true);
                        }}
                        item={displayItem}
                      />
                    );
                  })}
            </Box>
          </Scrollbars>
        </Box>
      </Box>
    </>
  );
}
