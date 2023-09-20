import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function ConfirmProgressDialog({
  isDialogOpen,
  closeDialog,
  handleConfirm,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  handleConfirm: () => void;
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
        {formatMessage({ id: 'confirmChangeDemandState' })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: theme.spacing(2) }}>
          {formatMessage({ id: 'confirmChangeDemandStatusMessage' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          color="primary"
          variant="outlined"
          onClick={closeDialog}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          color="primary"
          variant="contained"
          onClick={handleConfirm}
        >
          {formatMessage({ id: 'confirm' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
