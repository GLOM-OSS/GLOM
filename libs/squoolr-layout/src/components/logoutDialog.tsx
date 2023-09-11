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

export default function LogoutDialog({
  isDialogOpen,
  closeDialog,
  logout,
  isSubmitting,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  logout: () => void;
  isSubmitting: boolean;
}) {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      onClose={closeDialog}
      sx={{ color: theme.common.titleActive }}
    >
      <DialogTitle>{formatMessage({ id: 'confirmLogoutTitle' })}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {formatMessage({ id: 'confirmLogoutMessage' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={closeDialog} size="small">
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={logout}
          variant="contained"
          size="small"
        >
          {formatMessage({ id: 'logout' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
