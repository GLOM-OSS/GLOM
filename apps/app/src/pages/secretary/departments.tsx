import { AddRounded, ReportRounded, SearchRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Fab,
  FormControlLabel,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
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
  cycle_name?: string;
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

  const getAcademicItems = () => {
    setAreAcademicItemsLoading(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (notifications) setNotifications([...notifications, notif]);
    else setNotifications([notif]);
    setTimeout(() => {
      switch (usage) {
        case 'department': {
          //TODO: CALL API HERE TO GET departments with data showArchived
          if (random() > 5) {
            const newDepartments: DepartmentInterface[] = [
              {
                created_at: new Date(),
                item_acronym: 'GRT0001',
                item_name: 'Genie des reseaux et telecommunications',
                is_archived: false,
                item_code: 'sdh',
              },
              {
                created_at: new Date(),
                item_acronym: 'GRT0001',
                item_name: 'Genie des reseaux et telecommunications',
                is_archived: false,
                item_code: 'sds',
              },
              {
                created_at: new Date(),
                item_acronym: 'GRT0001',
                item_name: 'Genie des reseaux et telecommunications',
                is_archived: false,
                item_code: 'shs',
              },
              {
                created_at: new Date(),
                item_acronym: 'GRT0001',
                item_name: 'Genie des reseaux et telecommunications',
                is_archived: true,
                item_code: 'shs',
                deleted_at: new Date('12/12/2018'),
              },
            ];
            setAcademicItems(newDepartments);
            setAreAcademicItemsLoading(false);
            notif.dismiss();
            setNotifications([]);
          } else {
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
                  message={formatMessage({ id: 'getDepartmentsFailed' })}
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          }
          break;
        }
        case 'major': {
          //TODO: CALL API HERE TO GET majors with data showArchived
          if (random() > 5) {
            const newMajors: DepartmentInterface[] = [
              {
                created_at: new Date(),
                item_acronym: 'IRT',
                item_name: 'Informatiques reseaux et telecommunications',
                is_archived: false,
                item_code: 'sdh',
                cycle_name: 'licence',
                department_acronym: 'GRT',
              },
              {
                created_at: new Date(),
                item_acronym: 'IRT',
                item_name: 'Informatiques reseaux et telecommunications',
                is_archived: false,
                item_code: 'sdhk',
                cycle_name: 'licence',
                department_acronym: 'GRT',
              },
              {
                created_at: new Date(),
                item_acronym: 'IRT',
                item_name: 'Informatiques reseaux et telecommunications',
                is_archived: false,
                item_code: 'sdha',
                cycle_name: 'licence',
                department_acronym: 'GRT',
              },
              {
                created_at: new Date(),
                item_acronym: 'IRT',
                item_name: 'Informatiques reseaux et telecommunications',
                is_archived: false,
                item_code: 'sdhg',
                cycle_name: 'licence',
                department_acronym: 'GRT',
              },
            ];
            setAcademicItems(newMajors);
            setAreAcademicItemsLoading(false);
            notif.dismiss();
            setNotifications([]);
          } else {
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
                  message={formatMessage({
                    id: `get${usage[0].toUpperCase()}${usage.slice(
                      1,
                      undefined
                    )}sFailed`,
                  })}
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          }
          break;
        }
      }
    }, 3000);
  };

  useEffect(() => {
    getAcademicItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

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
    setTimeout(() => {
      if (activeAcademicItem) {
        //TODO: CALL API HERE TO EDIT DEPARTMENT with data newDepartment and department_id: activeDepartment.department_id
        if (random() > 5) {
          notif.update({
            render: formatMessage({ id: 'departmentEditedSuccessfully' }),
          });
          setActiveItem(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => createNewDepartment(newDepartment)}
                notification={notif}
                //TODO: MESSAGE SHOULD COME FROM BACKEND
                message={formatMessage({ id: 'failedToEditDepartment' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      } else {
        //TODO: CALL API HERE TO CREATE DEPARTMENT with data newDepartment
        if (random() > 5) {
          notif.update({
            render: formatMessage({ id: 'departmentCreatedSuccessfully' }),
          });
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => createNewDepartment(newDepartment)}
                notification={notif}
                //TODO: MESSAGE SHOULD COME FROM BACKEND
                message={formatMessage({ id: 'failedToCreateDepartment' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }
      setIsManagingDepartment(false);
    }, 3000);
  };

  const manageMajor = (value: {
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

    setTimeout(() => {
      if (activeAcademicItem) {
        //TODO: CALL API HERE TO EDIT major with data value.values and major_id: activeDepartment.item_id
        if (random() > 5) {
          notif.update({
            render: formatMessage({ id: 'majorEditedSuccessfully' }),
          });
          setActiveItem(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageMajor(value)}
                notification={notif}
                //TODO: MESSAGE SHOULD COME FROM BACKEND
                message={formatMessage({ id: 'failedToEditMajor' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      } else {
        //TODO: CALL API HERE TO CREATE major with data value
        if (random() > 5) {
          notif.update({
            render: formatMessage({ id: 'majorCreatedSuccessfully' }),
          });
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageMajor(value)}
                notification={notif}
                //TODO: MESSAGE SHOULD COME FROM BACKEND
                message={formatMessage({ id: 'failedToCreateMajor' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }
      setIsManagingDepartment(false);
    }, 3000);
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
    setTimeout(() => {
      setIsArchiving(false);
      if (activeAcademicItem?.is_archived) {
        switch (usage) {
          case 'department': {
            //TODO: CALL API HERE TO UNARCHIVE department with data activeAcademicItem
            if (random() > 5) {
              notif.update({
                render: formatMessage({
                  id: 'unarchivingSuccessfull',
                }),
              });
              setActiveItem(undefined);
            } else {
              notif.update({
                type: 'ERROR',
                render: (
                  <ErrorMessage
                    retryFunction={unArchiveItem}
                    notification={notif}
                    //TODO: MESSAGE SHOULD COME FROM BACKEND
                    message={formatMessage({
                      id: 'failedToUnarchive',
                    })}
                  />
                ),
                autoClose: false,
                icon: () => <ReportRounded fontSize="medium" color="error" />,
              });
            }
            break;
          }
          case 'major': {
            //TODO: CALL API HERE TO UNARCHIVE major with data activeAcademicItem
            if (random() > 5) {
              notif.update({
                render: formatMessage({
                  id: 'unarchivingSuccessfull',
                }),
              });
              setActiveItem(undefined);
            } else {
              notif.update({
                type: 'ERROR',
                render: (
                  <ErrorMessage
                    retryFunction={unArchiveItem}
                    notification={notif}
                    //TODO: MESSAGE SHOULD COME FROM BACKEND
                    message={formatMessage({
                      id: 'failedToUnarchive',
                    })}
                  />
                ),
                autoClose: false,
                icon: () => <ReportRounded fontSize="medium" color="error" />,
              });
            }
            break;
          }
        }
      } else {
        switch (usage) {
          case 'department': {
            //TODO: CALL API HERE TO ARCHIVE major with data activeAcademicItem
            if (random() > 5) {
              notif.update({
                render: formatMessage({
                  id: 'archivingSuccessfull',
                }),
              });
              setActiveItem(undefined);
            } else {
              notif.update({
                type: 'ERROR',
                render: (
                  <ErrorMessage
                    retryFunction={unArchiveItem}
                    notification={notif}
                    //TODO: MESSAGE SHOULD COME FROM BACKEND
                    message={formatMessage({
                      id: 'failedToArchive',
                    })}
                  />
                ),
                autoClose: false,
                icon: () => <ReportRounded fontSize="medium" color="error" />,
              });
            }
            break;
          }
          case 'major': {
            //TODO: CALL API HERE TO ARCHIVE major with data activeAcademicItem
            if (random() > 5) {
              notif.update({
                render: formatMessage({
                  id: 'archivingSuccessfull',
                }),
              });
              setActiveItem(undefined);
            } else {
              notif.update({
                type: 'ERROR',
                render: (
                  <ErrorMessage
                    retryFunction={unArchiveItem}
                    notification={notif}
                    //TODO: MESSAGE SHOULD COME FROM BACKEND
                    message={formatMessage({
                      id: 'failedToArchive',
                    })}
                  />
                ),
                autoClose: false,
                icon: () => <ReportRounded fontSize="medium" color="error" />,
              });
            }
            break;
          }
        }
      }
    }, 3000);
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
            gridTemplateColumns: 'auto 1fr',
            columnGap: theme.spacing(2),
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder={formatMessage({ id: `search${usage[0].toUpperCase()}${usage.slice(1,undefined)}Name` })}
            variant="outlined"
            size="small"
            sx={{
              '& input': { ...theme.typography.caption },
              backgroundColor: theme.common.inputBackground,
            }}
            disabled={areAcademicItemsLoading}
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
          <FormControlLabel
            control={
              <Checkbox
                disabled={areAcademicItemsLoading}
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
              disabled={areAcademicItemsLoading || isAddNewAcademicItemDialogOpen}
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
