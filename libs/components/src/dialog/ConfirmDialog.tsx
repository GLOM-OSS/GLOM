import {
  Button,
  CircularProgress,
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
  closeOnConfirm = false,
  isSubmitting = false,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: () => void;
  dialogMessage: string;
  dialogTitle?: string;
  confirmButton?: string;
  danger?: boolean;
  closeOnConfirm?: boolean;
  isSubmitting?: boolean;
}) {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={() => (isSubmitting ? null : closeDialog())}
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
          color="inherit"
          variant="outlined"
          onClick={() => (isSubmitting ? null : closeDialog())}
          disabled={isSubmitting}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          color={danger ? 'error' : 'primary'}
          variant="contained"
          disabled={isSubmitting}
          onClick={() => {
            confirm();
            if (!closeOnConfirm) closeDialog();
          }}
          startIcon={
            isSubmitting && <CircularProgress color="primary" size={18} />
          }
        >
          {confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
