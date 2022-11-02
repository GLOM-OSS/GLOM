import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  getCycles,
  getDepartments,
  getMajorDetails,
} from '@squoolr/api-services';
import { DialogTransition } from '@squoolr/dialogTransition';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { generateShort } from '@squoolr/utils';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export interface DepartmentInterface {
  department_code: string;
  department_name: string;
  department_acronym: string;
}

export interface CycleInterface {
  cycle_id: string;
  cycle_name: 'BACHELORS' | 'MASTER' | 'DOCTORATE' | 'DUT' | 'BTS' | 'DTS';
  number_of_years: number;
}

export interface FeeSetting {
  registration_fee: number;
  total_fee_due: number;
  level: number;
}

export interface MajorInterface {
  item_name: string;
  department_code: string;
  cycle_id: string;
  item_acronym: string;
}

export default function MajorDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  editableMajorCode,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: {
    values: MajorInterface;
    levelFees: FeeSetting[];
  }) => void;
  closeDialog: () => void;
  editableMajorCode?: string;
  levelFee?: FeeSetting[];
}) {
  const { formatMessage } = useIntl();
  const [major, setMajor] = useState<MajorInterface>({
    item_name: '',
    department_code: '',
    cycle_id: '',
    item_acronym: '',
  });
  const initialValues: MajorInterface = editableMajorCode
    ? major
    : {
        item_name: '',
        department_code: '',
        cycle_id: '',
        item_acronym: '',
      };
  const validationSchema = Yup.object().shape({
    department_code: Yup.string().required(formatMessage({ id: 'required' })),
    item_name: Yup.string().required(formatMessage({ id: 'required' })),
    cycle_id: Yup.string().required(formatMessage({ id: 'required' })),
    item_acronym: Yup.string().required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleSubmit({ values, levelFees });
      resetForm();
      close();
    },
  });

  const [isCodeGenerated, setIsCodeGenerated] = useState<boolean>(
    editableMajorCode ? false : true
  );
  const close = () => {
    closeDialog();
    formik.resetForm();
    setIsCodeGenerated(true);
    setLevelFees([]);
    setMajor({
      item_name: '',
      department_code: '',
      cycle_id: '',
      item_acronym: '',
    });
  };

  const [areDepartmentsLoading, setAreDepartmentsLoading] =
    useState<boolean>(false);
  const [departments, setDepartments] = useState<DepartmentInterface[]>([]);
  const [areCyclesLoading, setAreCyclesLoading] = useState<boolean>(false);
  const [cycles, setCycles] = useState<CycleInterface[]>([]);

  const [isMajorDataLoading, setIsMajorDataLoading] = useState<boolean>(false);
  const [levelFees, setLevelFees] = useState<FeeSetting[]>([]);

  const [notifications, setNotifications] = useState<
    { notif: useNotification; usage: 'department' | 'cycle' | 'major' }[]
  >([]);
  const loadDepartments = () => {
    setAreDepartmentsLoading(true);
    const notifs = notifications.filter(({ notif, usage }) => {
      if (usage === 'department') notif.dismiss();
      return usage !== 'department';
    });
    const notif = new useNotification();
    setNotifications([...notifs, { notif, usage: 'department' }]);
    getDepartments()
      .then((departments) => {
        setDepartments(departments);
        setAreDepartmentsLoading(false);
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
                error?.message || formatMessage({ id: 'loadDepartmentsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };
  const loadCycles = () => {
    setAreCyclesLoading(true);
    const notifs = notifications.filter(({ notif, usage }) => {
      if (usage === 'cycle') notif.dismiss();
      return usage !== 'cycle';
    });
    const notif = new useNotification();
    setNotifications([...notifs, { notif, usage: 'cycle' }]);

    getCycles()
      .then((cycles) => {
        setAreCyclesLoading(false);
        setCycles(cycles);
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingCycles' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCycles}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'loadCyclesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };
  const loadMajorData = () => {
    setIsMajorDataLoading(true);
    const notifs = notifications.filter(({ notif, usage }) => {
      if (usage === 'major') notif.dismiss();
      return usage !== 'major';
    });
    const notif = new useNotification();
    setNotifications([...notifs, { notif, usage: 'major' }]);
    getMajorDetails(editableMajorCode as string)
      .then(
        ({
          levelFees,
          major_name: item_name,
          major_acronym: item_acronym,
          major_code: item_code,
          ...major
        }) => {
          setIsMajorDataLoading(false);
          setMajor({
            item_name,
            item_acronym,
            ...major,
          });
          setLevelFees(levelFees);
        }
      )
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingMajor' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajorData}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'loadMajorFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (isDialogOpen) {
      loadDepartments();
      loadCycles();
      if (editableMajorCode) loadMajorData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen, editableMajorCode]);

  function handleFeeSettingChange(
    element: 'registration_fee' | 'total_fee_due',
    value: number,
    level: number
  ) {
    const newVal = {
      ...(levelFees.find(({ level: lvl }) => level === lvl) as FeeSetting),
      [element]: value,
    };
    setLevelFees([
      ...levelFees.filter(({ level: lvl }) => level !== lvl),
      newVal,
    ]);
  }

  useEffect(() => {
    const item = cycles.find(
      ({ cycle_id }) => formik.values.cycle_id === cycle_id
    );
    const newArr: FeeSetting[] = levelFees.filter(
      ({ level }) => level <= (item?.number_of_years || 0)
    );
    for (
      let index = 0;
      index < (item !== undefined ? item.number_of_years : 0);
      index++
    ) {
      if (index + 1 === item?.number_of_years) {
        if (!newArr.find(({ level }) => level === index + 1))
          setLevelFees([
            ...newArr,
            { registration_fee: 0, total_fee_due: 0, level: index + 1 },
          ]);
        else setLevelFees([...newArr]);
      } else if (!newArr.find(({ level }) => level === index + 1))
        newArr.push({
          registration_fee: 0,
          total_fee_due: 0,
          level: index + 1,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.cycle_id]);

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'center',
            marginTop: theme.spacing(1),
          }}
        >
          <DialogTitle>
            {formatMessage({
              id: editableMajorCode ? 'editMajor' : 'addNewMajor',
            })}
          </DialogTitle>
          <TextField
            placeholder={formatMessage({ id: 'major_acronym' })}
            sx={{
              width: '120px',
              marginRight: theme.spacing(2),
              justifySelf: 'end',
            }}
            required
            color="primary"
            size="small"
            id="item_acronym"
            onBlur={formik.handleBlur}
            value={formik.values.item_acronym}
            disabled={Boolean(editableMajorCode)}
            error={
              formik.touched.item_acronym && Boolean(formik.errors.item_acronym)
            }
            helperText={
              formik.touched.item_acronym && formik.errors.item_acronym
            }
            onChange={(event) => {
              setIsCodeGenerated(event.target.value.length === 0);
              formik.setFieldValue('item_acronym', event.target.value);
            }}
          />
        </Box>
        <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'major_name' })}
            fullWidth
            value={formik.values.item_name}
            id="item_name"
            required
            color="primary"
            disabled={isMajorDataLoading}
            onChange={(event) => {
              formik.setFieldValue('item_name', event.target.value);
              if (isCodeGenerated)
                formik.setFieldValue(
                  'item_acronym',
                  generateShort(event.target.value)
                );
            }}
            error={formik.touched.item_name && Boolean(formik.errors.item_name)}
            helperText={formik.touched.item_name && formik.errors.item_name}
            onBlur={formik.handleBlur}
          />
          <TextField
            autoFocus
            select
            placeholder={formatMessage({ id: 'department' })}
            label={formatMessage({ id: 'selectDepartment' })}
            fullWidth
            required
            color="primary"
            disabled={areDepartmentsLoading || isMajorDataLoading}
            {...formik.getFieldProps('department_code')}
            error={
              formik.touched.department_code &&
              Boolean(formik.errors.department_code)
            }
            helperText={
              formik.touched.department_code && formik.errors.department_code
            }
          >
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
          <TextField
            autoFocus
            select
            placeholder={formatMessage({ id: 'cycle' })}
            label={formatMessage({ id: 'selectCycle' })}
            fullWidth
            required
            disabled={areCyclesLoading || isMajorDataLoading}
            color="primary"
            {...formik.getFieldProps('cycle_id')}
            error={formik.touched.item_name && Boolean(formik.errors.item_name)}
            helperText={formik.touched.item_name && formik.errors.item_name}
          >
            {cycles.map(({ cycle_id, cycle_name, number_of_years }, index) => (
              <MenuItem key={index} value={cycle_id}>{`${formatMessage({
                id: cycle_name,
              })} - (${number_of_years} ${formatMessage({
                id: 'years',
              })})`}</MenuItem>
            ))}
          </TextField>
          {cycles.find(
            ({ cycle_id }) => cycle_id === formik.values.cycle_id
          ) && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {formatMessage({ id: 'feeSettings' })}
              </Typography>
              {[
                ...new Array(
                  cycles.find(
                    ({ cycle_id }) => cycle_id === formik.values.cycle_id
                  )?.number_of_years
                ),
              ].map((_, index) => (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr 1fr',
                    alignItems: 'center',
                    columnGap: theme.spacing(2),
                    marginTop: theme.spacing(1),
                  }}
                >
                  <Typography>{`${formatMessage({ id: 'level' })} ${
                    index + 1
                  }`}</Typography>
                  <TextField
                    autoFocus
                    placeholder={formatMessage({ id: 'registration_fee' })}
                    label={formatMessage({ id: 'registration_fee' })}
                    fullWidth
                    type="number"
                    size="small"
                    onChange={(e) =>
                      handleFeeSettingChange(
                        'registration_fee',
                        Number(e.target.value),
                        index + 1
                      )
                    }
                    value={Number(
                      levelFees.find(({ level }) => level === index + 1)
                        ?.registration_fee
                    )}
                    required
                    disabled={isMajorDataLoading}
                    color="primary"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body2">{'FCFA'}</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    autoFocus
                    placeholder={formatMessage({ id: 'total_fee_due' })}
                    label={formatMessage({ id: 'total_fee_due' })}
                    fullWidth
                    type="number"
                    size="small"
                    onChange={(e) =>
                      handleFeeSettingChange(
                        'total_fee_due',
                        Number(e.target.value),
                        index + 1
                      )
                    }
                    required
                    disabled={isMajorDataLoading}
                    value={
                      levelFees.find(({ level }) => level === index + 1)
                        ?.total_fee_due
                    }
                    color="primary"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body2">{'FCFA'}</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="text"
            onClick={close}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          {editableMajorCode && (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={isMajorDataLoading}
              /* TODO: LOOK FOR HOW TO KNOW IF THEY HAVE EDITED MAJOR
                the issue is the fact that modifying a major can be the fees or the data hence disabled cannot be blocked on major data but also on fee data 
            */
            >
              {formatMessage({ id: 'save' })}
            </Button>
          )}
          {!editableMajorCode && (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                formik.values.item_name === '' ||
                formik.values.cycle_id === '' ||
                formik.values.department_code === ''
              }
            >
              {formatMessage({ id: 'create' })}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
