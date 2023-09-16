import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  lighten,
  TextField,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { AcademicProfile } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function ProfileDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  editableProfile,
  weightingSystem,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: AcademicProfile) => void;
  closeDialog: () => void;
  editableProfile?: AcademicProfile;
  weightingSystem: number;
}) {
  const { formatMessage } = useIntl();
  const initialValues: AcademicProfile = editableProfile ?? {
    annual_academic_profile_id: 'lskd',
    comment: '',
    maximum_score: 0,
    minimum_score: 0,
  };

  const validationSchema = Yup.object().shape({
    academic_profile_id: Yup.string(),
    minimum_score: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .min(0, formatMessage({ id: 'greaterOrEqual0' }))
      .max(weightingSystem, formatMessage({ id: 'lesserOrEqualWeighting' })),
    maximum_score: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .min(0, formatMessage({ id: 'greaterOrEqualMinimum' }))
      .max(weightingSystem, formatMessage({ id: 'lesserOrEqualWeighting' })),
    comment: Yup.string().required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
      resetForm();
      close();
    },
  });

  const close = () => {
    closeDialog();
    formik.resetForm();
  };

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
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            paddingRight: theme.spacing(3),
          }}
        >
          <DialogTitle>{formatMessage({ id: 'academicProfile' })}</DialogTitle>
          <Chip
            size="small"
            sx={{
              backgroundColor: lighten(theme.palette.success.main, 0.6),
              justifySelf: 'end',
            }}
            label={`${formatMessage({ id: 'weightingOn' })} ${weightingSystem}`}
          />
        </Box>
        <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'minimum' })}
            label={formatMessage({ id: 'minimum' })}
            required
            color="primary"
            type="number"
            {...formik.getFieldProps('minimum_score')}
            error={
              formik.touched.minimum_score &&
              Boolean(formik.errors.minimum_score)
            }
            helperText={
              formik.touched.minimum_score && formik.errors.minimum_score
            }
          />
          <TextField
            placeholder={formatMessage({ id: 'maximum' })}
            label={formatMessage({ id: 'maximum' })}
            required
            color="primary"
            type="number"
            {...formik.getFieldProps('maximum_score')}
            error={
              formik.touched.maximum_score &&
              Boolean(formik.errors.maximum_score)
            }
            helperText={
              formik.touched.maximum_score && formik.errors.maximum_score
            }
          />
          <TextField
            placeholder={formatMessage({ id: 'comment' })}
            label={formatMessage({ id: 'comment' })}
            fullWidth
            required
            color="primary"
            {...formik.getFieldProps('comment')}
            error={formik.touched.comment && Boolean(formik.errors.comment)}
            helperText={formik.touched.comment && formik.errors.comment}
          />
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
          {editableProfile ? (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                editableProfile.minimum_score === formik.values.minimum_score &&
                editableProfile.maximum_score === formik.values.maximum_score &&
                editableProfile.comment === formik.values.comment
              }
            >
              {formatMessage({ id: 'save' })}
            </Button>
          ) : (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
            >
              {formatMessage({ id: 'create' })}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
