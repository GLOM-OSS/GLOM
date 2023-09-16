import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DesktopTimePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { ActivateAssessment } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function ActivateAssessmentDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  isAssignment = false,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: ActivateAssessment) => void;
  closeDialog: () => void;
  isAssignment?: boolean;
}) {
  const { formatMessage } = useIntl();

  const [assessmentDate, setAssessmentDate] = useState<Date>(new Date());
  const [assessmentTime, setAssessmentTime] = useState<Date>(new Date());
  const [durationInMinutes, setDurationInMinutes] = useState<number>(0);

  const close = () => {
    closeDialog();
    setDurationInMinutes(0);
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
            if (isAssignment)
              handleSubmit({
                assessment_date: assessmentDate,
                assessment_time: assessmentTime,
                duration: null,
              });
            else if (durationInMinutes > 0)
              handleSubmit({
                assessment_date: assessmentDate,
                assessment_time: assessmentTime,
                duration: durationInMinutes,
              });
            else alert(formatMessage({ id: 'durationMustBeGreaterThanZero' }));
          else alert(formatMessage({ id: 'mustHaveDateAndTime' }));
          close();
        }}
      >
        <DialogTitle>
          {formatMessage({
            id: isAssignment ? 'activateAssignment' : 'activateAssessment',
          })}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'grid',
            rowGap: 2,
          }}
        >
          <MobileDatePicker
            label={formatMessage({
              id: isAssignment ? 'assignmentDueDate' : 'assessmentDate',
            })}
            value={assessmentDate}
            minDate={dayjs(new Date())}
            onChange={(newValue) => {
              setAssessmentDate(new Date(String(newValue)));
            }}
            renderInput={(params) => (
              <TextField {...params} sx={{ marginTop: 1 }} />
            )}
          />
          <DesktopTimePicker
            label={formatMessage({
              id: isAssignment ? 'assignmentDueTime' : 'assessmentTime',
            })}
            value={assessmentTime}
            onChange={(newValue) => {
              setAssessmentTime(new Date(String(newValue)));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          {!isAssignment && (
            <TextField
              sx={{ marginTop: theme.spacing(1) }}
              placeholder={formatMessage({ id: 'assessmentDuration' })}
              label={formatMessage({ id: 'assessmentDuration(mins)' })}
              required
              color="primary"
              type="number"
              value={durationInMinutes}
              onChange={(event) => {
                if (Number(event.target.value) >= 0)
                  setDurationInMinutes(Number(event.target.value));
              }}
            />
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
