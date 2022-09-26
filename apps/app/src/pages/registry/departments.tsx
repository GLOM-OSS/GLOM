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
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import AcademicItem, { AcademicItemSkeleton } from '../../AcademicItem';

export interface DepartmentInterface {
  department_name: string;
  created_at: Date;
  is_archived: boolean;
  department_code: string;
  deleted_at?: Date;
  department_id: string;
}

export default function Departments() {
  const { formatMessage } = useIntl();
  const [activeDepartment, setActiveDepartment] =
    useState<DepartmentInterface>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] =
    useState<boolean>(false);
  const [departments, setDepartments] = useState<DepartmentInterface[]>([]);
  const [areDepartmentsLoading, setAreDepartmentsLoading] =
    useState<boolean>(true);

  const [notifications, setNotifications] = useState<useNotification[]>();
  const getDepartments = () => {
    setAreDepartmentsLoading(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (notifications) setNotifications([...notifications, notif]);
    else setNotifications([notif]);
    setTimeout(() => {
      //TODO: CALL API HERE TO GET departments
      if (random() > 5) {
        const newDepartments: DepartmentInterface[] = [
          {
            created_at: new Date(),
            department_code: 'GRT0001',
            department_name: 'Genie des reseaux et telecommunications',
            is_archived: false,
            department_id: 'sdh',
          },
          {
            created_at: new Date(),
            department_code: 'GRT0001',
            department_name: 'Genie des reseaux et telecommunications',
            is_archived: false,
            department_id: 'sds',
          },
          {
            created_at: new Date(),
            department_code: 'GRT0001',
            department_name: 'Genie des reseaux et telecommunications',
            is_archived: false,
            department_id: 'shs',
          },
          {
            created_at: new Date(),
            department_code: 'GRT0001',
            department_name: 'Genie des reseaux et telecommunications',
            is_archived: true,
            department_id: 'shs',
            deleted_at: new Date('12/12/2018'),
          },
        ];
        setDepartments(newDepartments);
        setAreDepartmentsLoading(false);
        notif.dismiss();
        setNotifications([]);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingDepartments' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getDepartments}
              notification={notif}
              message={formatMessage({ id: 'getDepartmentsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    getDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
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
          placeholder={formatMessage({ id: 'searchSomething' })}
          variant="outlined"
          size="small"
          sx={{
            '& input': { ...theme.typography.caption },
            backgroundColor: theme.common.inputBackground,
          }}
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
          control={<Checkbox color="primary" />}
          label={formatMessage({ id: 'showArchived' })}
          sx={{ '& .MuiTypography-root': { ...theme.typography.body2 } }}
        />
      </Box>
      <Box sx={{ height: '100%', position: 'relative' }}>
        <Fab
          disabled={areDepartmentsLoading}
          color="primary"
          sx={{ position: 'absolute', bottom: 16, right: 24 }}
        >
          <Tooltip arrow title={formatMessage({ id: 'newDepartment' })}>
            <AddRounded />
          </Tooltip>
        </Fab>
        <Scrollbars>
          <Box
            sx={{
              display: 'grid',
              justifyContent: 'center',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: theme.spacing(2),
            }}
          >
            {areDepartmentsLoading &&
              [...new Array(10)].map((_, index) => (
                <AcademicItemSkeleton key={index} />
              ))}
            {!areDepartmentsLoading && departments.length === 0 && (
              <Box
                component={Button}
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
                  {formatMessage({ id: 'addNewDepartment' })}
                </Typography>
              </Box>
            )}
            {!areDepartmentsLoading &&
              departments.length > 0 &&
              departments.map((department, index) => {
                const {
                  created_at,
                  department_code: item_code,
                  department_name: item_name,
                  is_archived,
                  deleted_at,
                } = department;
                return (
                  <AcademicItem
                    key={index}
                    handleEditClick={() => {
                      setActiveDepartment(department);
                      setIsEditDialogOpen(true);
                    }}
                    handleArchiveClick={() => {
                      setActiveDepartment(department);
                      setIsArchiveDialogOpen(true);
                    }}
                    item={{
                      created_at,
                      item_code,
                      item_name,
                      is_archived,
                      deleted_at,
                    }}
                  />
                );
              })}
          </Box>
        </Scrollbars>
      </Box>
    </Box>
  );
}
