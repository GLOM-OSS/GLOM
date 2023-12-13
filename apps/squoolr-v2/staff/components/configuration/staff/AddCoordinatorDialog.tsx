import {
  useClassrooms,
  useStaffMember,
  useStaffMembers,
  useUpdateStaffMember,
} from '@glom/data-access/squoolr';
import {
  ClassroomEntity,
  CoordinatorEntity,
  CreateStaffPayload,
} from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import { ArrowDropDown } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function AddCoordinatorDialog({
  closeDialog,
  isDialogOpen,
}: {
  closeDialog: () => void;
  isDialogOpen: boolean;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  // TODO: MAKE THE AUTOCOMPLETE INITIAL VALUES LOAD WHEN PRESENT... I CANT SEEM TO FIGURE IT OUT.

  const { data: teachers, isFetching: isFetchingTeachers } = useStaffMembers({
    roles: ['TEACHER'],
  });

  const { data: classrooms, isFetching: isFetchingClassrooms } =
    useClassrooms();

  const [selectedCoordinator, setSelectedCoordinator] =
    useState<CoordinatorEntity>();

  const initialValues: CreateStaffPayload['payload'] = {
    role: 'COORDINATOR',
    annual_teacher_id: selectedCoordinator
      ? selectedCoordinator.annual_teacher_id
      : '',
    annualClassroomIds: selectedCoordinator
      ? selectedCoordinator.annualClassroomIds
      : [],
  };
  const validationSchema = Yup.object().shape({
    annual_teacher_id: Yup.string()
      .oneOf(
        teachers
          ? teachers.map(({ annual_teacher_id }) => annual_teacher_id)
          : []
      )
      .required(formatMessage({ id: 'required' })),
    annualClassroomIds: Yup.array()
      .of(
        Yup.string().oneOf(
          classrooms
            ? classrooms.map(({ annual_classroom_id }) => annual_classroom_id)
            : []
        )
      )
      .min(
        selectedCoordinator
          ? selectedCoordinator.annualClassroomIds.length > 0
            ? 0
            : 1
          : 1
      )
      .required(formatMessage({ id: 'required' })),
  });

  const { mutate: updateCoordinator, isPending: isSubmitting } =
    useUpdateStaffMember(selectedCoordinator?.annual_teacher_id);
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      updateCoordinator(
        {
          payload: values,
        },
        {
          onSuccess() {
            resetForm();
            setSelectedCoordinator(undefined);
            close();
          },
        }
      );
    },
  });

  const { data: fetchedCoordinator, isFetching: isLoadingCoordinatorDetails } =
    useStaffMember<CoordinatorEntity>(
      formik.values.annual_teacher_id,
      'COORDINATOR'
    );
  useEffect(() => {
    if (fetchedCoordinator) {
      setSelectedCoordinator(fetchedCoordinator);
    }
  }, [fetchedCoordinator]);

  function close() {
    setSelectedCoordinator(undefined);
    closeDialog();
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={close}
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
    >
      <DialogTitle>{formatMessage({ id: 'addCoordinator' })}</DialogTitle>
      <DialogContent>
        <Box
          sx={{ padding: '14px 0px 0px 0px', display: 'grid', rowGap: 2 }}
          onSubmit={formik.handleSubmit}
          component="form"
        >
          <FormControl
            fullWidth
            sx={{
              '& .MuiSelect-select': {
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          >
            <InputLabel>{formatMessage({ id: 'selectTeacher' })}</InputLabel>
            <Select
              size="small"
              label={formatMessage({ id: 'selectTeacher' })}
              {...formik.getFieldProps('annual_teacher_id')}
              required
              disabled={
                isFetchingTeachers || isFetchingClassrooms || isSubmitting
              }
            >
              {teachers.map(
                ({ annual_teacher_id, first_name, last_name }, index) => (
                  <MenuItem key={index} value={annual_teacher_id}>
                    {`${first_name} ${last_name}`}
                  </MenuItem>
                )
              )}
            </Select>
            {formik.touched.annual_teacher_id &&
              !!formik.errors.annual_teacher_id && (
                <FormHelperText sx={{ color: theme.palette.error.main }}>
                  {formik.errors.annual_teacher_id}
                </FormHelperText>
              )}
          </FormControl>
          <Autocomplete
            multiple
            options={classrooms ?? []}
            autoHighlight
            size="small"
            disabled={
              isSubmitting ||
              isFetchingClassrooms ||
              isFetchingTeachers ||
              isLoadingCoordinatorDetails
            }
            popupIcon={
              isLoadingCoordinatorDetails || isFetchingClassrooms ? (
                <CircularProgress color="primary" size={18} />
              ) : (
                <ArrowDropDown />
              )
            }
            getOptionLabel={({ classroom_acronym, classroom_level }) =>
              `${classroom_acronym} ${classroom_level}`
            }
            renderOption={(
              props,
              { classroom_acronym, classroom_level, annual_classroom_id }
            ) => {
              return (
                <Typography
                  {...props}
                  key={annual_classroom_id}
                  component="li"
                >{`${classroom_acronym} ${classroom_level}`}</Typography>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={
                  formik.touched.annualClassroomIds &&
                  !!formik.errors.annualClassroomIds &&
                  formik.errors.annualClassroomIds
                }
                placeholder={formatMessage({ id: 'selectClassrooms' })}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'autocomplete',
                }}
              />
            )}
            {...formik.getFieldProps('annual_classroom_id')}
            onChange={(e, val) => {
              formik.setFieldValue(
                'annualClassroomIds',
                (val as ClassroomEntity[]).map(
                  ({ annual_classroom_id }) => annual_classroom_id
                )
              );
            }}
          />
          <DialogActions
            sx={{
              justifyContent: 'center',
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: '20px',
              padding: '30px 0 0 0 !important',
            }}
          >
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => (isSubmitting ? null : close())}
              disabled={isSubmitting}
            >
              {formatMessage({ id: 'cancel' })}
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={
                isSubmitting ||
                formik.values.annualClassroomIds.join(',') ===
                  (selectedCoordinator
                    ? selectedCoordinator.annualClassroomIds
                    : []
                  ).join(',')
              }
              type="submit"
              startIcon={
                isSubmitting && <CircularProgress color="primary" size={18} />
              }
            >
              {formatMessage({ id: 'save' })}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
