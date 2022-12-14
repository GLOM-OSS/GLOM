import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { useIntl } from 'react-intl';

export function ConfirmDeleteDialog({
  isDialogOpen,
  closeDialog,
  confirm,
  deleteMessage
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: () => void;
  deleteMessage: string
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
          {formatMessage({
            id: 'delete',
          })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{formatMessage({id:deleteMessage})}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          color="error"
          variant="text"
          onClick={closeDialog}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          color="primary"
          variant="contained"
          onClick={() => {
            confirm();
            closeDialog();
          }}
        >
          {formatMessage({ id: 'delete' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
