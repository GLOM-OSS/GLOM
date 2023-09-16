import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export function ConfirmDeleteDialog({
  isDialogOpen,
  closeDialog,
  confirm,
  dialogMessage,
  dialogTitle = 'delete',
  confirmButton = 'delete',
  danger = false,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: () => void;
  dialogMessage: string;
  dialogTitle?: string;
  confirmButton?: string;
  danger?: boolean;
}) {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle
        sx={{ color: danger ? theme.palette.error.main : 'initial' }}
      >
        {formatMessage({
          id: dialogTitle,
        })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {formatMessage({ id: dialogMessage })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          color={danger ? 'primary' : 'error'}
          variant={danger ? 'outlined' : 'text'}
          onClick={closeDialog}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          color={danger ? 'error' : 'primary'}
          variant={danger ? 'outlined' : 'contained'}
          onClick={() => {
            confirm();
            closeDialog();
          }}
        >
          {formatMessage({ id: confirmButton })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
