import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';
import { DialogTransition } from './dialog-transition';

export function ConfirmDialog({
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
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: danger ? theme.palette.error.main : 'initial',
          textAlign: 'center',
        }}
      >
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogMessage}</DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: '20px',
        }}
      >
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
          {confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
