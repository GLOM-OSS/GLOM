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
import { IntlShape } from 'react-intl';

export default function LogoutDialog({
  intl: { formatMessage },
  isDialogOpen,
  closeDialog,
  logout,
}: {
  intl: IntlShape;
  isDialogOpen: boolean;
  closeDialog: () => void;
  logout: () => void;
}) {
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
        <Button onClick={closeDialog} size='small'>{formatMessage({ id: 'cancel' })}</Button>
        <Button onClick={logout} variant='contained' size='small'>{formatMessage({ id: 'logout' })}</Button>
      </DialogActions>
    </Dialog>
  );
}
