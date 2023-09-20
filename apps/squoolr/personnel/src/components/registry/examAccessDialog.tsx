import { ReportRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { getExamAccess } from '@squoolr/api-services';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { SemesterExamAccess } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function ExamAccessDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: SemesterExamAccess[]) => void;
  closeDialog: () => void;
}) {
  const { formatMessage } = useIntl();

  const [isWeightingSystemLoading, setAreExamAccessesLoading] =
    useState<boolean>(false);
  const [examAccessNotif, setExamAccessNotif] = useState<useNotification>();
  const [examAccess, setExamAcces] = useState<{
    first_semester: number;
    second_semester: number;
  }>();

  const initialValues: { first_semester: number; second_semester: number } =
    examAccess ?? {
      first_semester: 50,
      second_semester: 50,
    };
  const validationSchema = Yup.object().shape({
    first_semester: Yup.number()
      .min(0, formatMessage({ id: 'greaterOrEqual0' }))
      .max(100, formatMessage({ id: 'lesserOrEqual100' }))
      .required(formatMessage({ id: 'required' })),
    second_semester: Yup.number()
      .min(0, formatMessage({ id: 'greaterOrEqual0' }))
      .max(100, formatMessage({ id: 'lesserOrEqual100' }))
      .required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: ({ first_semester, second_semester }, { resetForm }) => {
      if (examAccess) {
        handleSubmit([
          {
            annual_semester_number: 1,
            payment_percentage: first_semester,
          },
          {
            annual_semester_number: 2,
            payment_percentage: second_semester,
          },
        ]);
        resetForm();
        close();
      } else {
        const theNotif = new useNotification();
        theNotif.notify({ render: formatMessage({ id: 'noExamAccesses' }) });
        theNotif.update({
          type: 'ERROR',
          render: 'noExamAccesses',
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    },
  });

  const close = () => {
    closeDialog();
    formik.resetForm();
  };

  const loadExamAccesses = () => {
    setAreExamAccessesLoading(true);
    const notif = new useNotification();
    if (examAccessNotif) {
      examAccessNotif.dismiss();
    }
    setExamAccessNotif(notif);
    getExamAccess()
      .then((examAccesses) => {
        const fs = examAccesses.find(
          ({ annual_semester_number: asn }) => asn === 1
        );
        const ss = examAccesses.find(
          ({ annual_semester_number: asn }) => asn === 2
        );
        setExamAcces({
          first_semester: fs ? fs.payment_percentage : 49,
          second_semester: ss ? ss.payment_percentage : 100,
        });
        setAreExamAccessesLoading(false);
        notif.dismiss();
        setExamAccessNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingExamAccesses' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadExamAccesses}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getExamAccessesFailed' })
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
      loadExamAccesses();
    }
    return () => {
      //TODO: CLEANUP FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {formatMessage({ id: 'examHallAccessCondition' })}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
          <DialogContentText>
            {formatMessage({ id: 'examHallAcessConditionMessage' })}
          </DialogContentText>
          <DialogContentText>
            {formatMessage({ id: 'examHallAccessConditionExample' })}
          </DialogContentText>
          <TextField
            placeholder={formatMessage({ id: 'first_semester' })}
            label={formatMessage({ id: 'first_semester' })}
            fullWidth
            required
            color="primary"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">%</Typography>
                </InputAdornment>
              ),
            }}
            {...formik.getFieldProps('first_semester')}
            error={
              formik.touched.first_semester &&
              Boolean(formik.errors.first_semester)
            }
            helperText={
              formik.touched.first_semester && formik.errors.first_semester
            }
          />
          <TextField
            placeholder={formatMessage({ id: 'second_semester' })}
            label={formatMessage({ id: 'second_semester' })}
            fullWidth
            required
            color="primary"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">%</Typography>
                </InputAdornment>
              ),
            }}
            {...formik.getFieldProps('second_semester')}
            error={
              formik.touched.second_semester &&
              Boolean(formik.errors.second_semester)
            }
            helperText={
              formik.touched.second_semester && formik.errors.second_semester
            }
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
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            disabled={
              isWeightingSystemLoading ||
              (formik.values.first_semester === examAccess?.first_semester &&
                formik.values.second_semester === examAccess?.second_semester)
            }
            type="submit"
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
