import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DesktopTimePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { DialogTransition } from '@squoolr/dialogTransition';
import { ActivateAssessment } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function ActivateAssessmentDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: ActivateAssessment) => void;
  closeDialog: () => void;
}) {
  const { formatMessage } = useIntl();

  //   const initialValues: ActivateAssessment = {
  //     assessment_date: new Date(),
  //     assessment_time: new Date(),
  //     duration: 0,
  //   };

  //   const validationSchema = Yup.object().shape({
  //     duration: Yup.number().min(0, formatMessage({ id: 'minAllowedValue0' })),
  //     assessment_date: Yup.date().required(formatMessage({ id: 'required' })),
  //     assessment_time: Yup.date().required(formatMessage({ id: 'required' })),
  //   });

  //   const formik = useFormik({
  //     initialValues,
  //     validationSchema,
  //     enableReinitialize: true,
  //     onSubmit: (values) => {
  //       handleSubmit(values);
  //       close();
  //     },
  //   });

  const [assessmentDate, setAssessmentDate] = useState<Date>(new Date());
  const [assessmentTime, setAssessmentTime] = useState<Date>(new Date());
  const [duration, setDuration] = useState<number>(0);

  const close = () => {
    closeDialog();
    setDuration(0);
  };

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (assessmentDate && assessmentTime)
            handleSubmit({
              assessment_date: assessmentDate,
              assessment_time: assessmentTime,
              duration,
            });
          close();
        }}
      >
        <DialogTitle>
          {formatMessage({
            id: 'activateAssessment',
          })}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'grid',
            rowGap: theme.spacing(2),
          }}
        >
          <MobileDatePicker
            label={formatMessage({ id: 'assessmentDate' })}
            // {...formik.getFieldProps('assessment_date')}
            value={assessmentDate}
            minDate={dayjs(new Date())}
            onChange={(newValue) => {
              setAssessmentDate(new Date(String(newValue)));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopTimePicker
            label={formatMessage({ id: 'assessmentTime' })}
            value={assessmentTime}
            onChange={(newValue) => {
              setAssessmentTime(new Date(String(newValue)));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <TextField
            sx={{ marginTop: theme.spacing(1) }}
            placeholder={formatMessage({ id: 'assessmentDuration' })}
            label={formatMessage({ id: 'assessmentDuration(mins)' })}
            required
            color="primary"
            type="number"
            value={duration}
            onChange={(event) => {
              if (Number(event.target.value) >= 0)
                setDuration(Number(event.target.value));
            }}
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
            type="submit"
          >
            {formatMessage({ id: 'activate' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
