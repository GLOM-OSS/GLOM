import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function ConfirmSubmitAssessmentDialog({
  isDialogOpen,
  closeDialog,
  confirm,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: () => void;
}) {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle>
        {formatMessage({ id: 'confirmSubmitEvaluation' })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: theme.spacing(2) }}>
          {formatMessage({ id: 'confirmSubmitEvaluationMessage' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          variant="outlined"
          color="error"
          onClick={closeDialog}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          variant="contained"
          color="primary"
          onClick={confirm}
        >
          {formatMessage({ id: 'submit' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
