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
import { useIntl } from 'react-intl';
import {
  ClassroomEntity,
  CoordinatorEntity,
  CreateStaffPayload,
  TeacherEntity,
} from '@glom/data-types/squoolr';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import { useTheme } from '@glom/theme';

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

  const [teachers, setTeachers] = useState<TeacherEntity[]>([
    {
      annual_teacher_id: 'boston123',
      email: 'lorraintchakoumi@gmail.com',
      first_name: 'Tchakoumi Lorrain',
      has_signed_convention: false,
      has_tax_payers_card: false,
      hourly_rate: 200,
      is_deleted: false,
      last_connected: new Date().toISOString(),
      last_name: 'Kouatchoua',
      login_id: 'sei',
      matricule: '17c005',
      origin_institute: 'udm',
      phone_number: '+237657140183',
      role: 'TEACHER',
      roles: ['TEACHER'],
      teacher_type_id: 'sieols',
      teaching_grade_id: '',
    },
  ]);
  const [classrooms, setClassrooms] = useState<ClassroomEntity[]>([
    {
      annual_classroom_id: 'wieos',
      annual_coordinator_id: '',
      annual_major_id: '',
      classroom_acronym: 'IRT',
      classroom_id: 'clesan',
      classroom_level: 2,
      classroom_name: 'Informatique Reseau telecommunications',
      created_at: new Date().toISOString(),
      is_deleted: false,
      number_of_divisions: 1,
    },
    {
      annual_classroom_id: 'wsieos',
      annual_coordinator_id: '',
      annual_major_id: '',
      classroom_acronym: 'IMB',
      classroom_id: 'clesan',
      classroom_level: 3,
      classroom_name: 'Ingenieurie, Biomedical',
      created_at: new Date().toISOString(),
      is_deleted: false,
      number_of_divisions: 1,
    },
  ]);

  const [selectedCoordinator, setSelectedCoordinator] =
    useState<CoordinatorEntity>();

  const [isFetchingTeachers, setIsFetchingTeachers] = useState<boolean>(false);
  const [isFetchingClassrooms, setIsFetchingClassrooms] =
    useState<boolean>(false);

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

  //TODO: REMOVE THIS AND REPLACE WITH reactQuery own
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(true);
      //TODO; call api here to create or update coordinator
      setTimeout(() => {
        setIsSubmitting(false);
        resetForm();
        setSelectedCoordinator(undefined);
        close();
      }, 3000);
    },
  });

  //TODO: REMOVE THIS AND REPLACE WITH reactQuery own
  const [isLoadingCoordinatorDetails, setIsLoadingCoordinatorDetails] =
    useState<boolean>(false);
  useEffect(() => {
    if (!!formik.values.annual_teacher_id) {
      //TODO: CALL API HERE TO FETCH COORDINATOR WITH DATA formik.values.annual_teacher_id
      setIsLoadingCoordinatorDetails(true);
      setTimeout(() => {
        const teacherCoordinator: CoordinatorEntity = {
          annual_teacher_id: 'boston123',
          email: 'lorraintchakoumi@gmail.com',
          first_name: 'Tchakoumi Lorrain',
          has_signed_convention: false,
          has_tax_payers_card: false,
          hourly_rate: 200,
          is_deleted: false,
          last_connected: new Date().toISOString(),
          last_name: 'Kouatchoua',
          login_id: 'sei',
          matricule: '17c005',
          origin_institute: 'udm',
          phone_number: '+237657140183',
          role: 'COORDINATOR',
          roles: ['TEACHER'],
          teacher_type_id: 'sieols',
          teaching_grade_id: '',
          annualClassroomIds: [],
        };
        setIsLoadingCoordinatorDetails(false);
        setSelectedCoordinator(teacherCoordinator);
      }, 3000);
    }
  }, [formik.values.annual_teacher_id]);

  function close() {
    setSelectedCoordinator(undefined);
    setIsLoadingCoordinatorDetails(false);
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
