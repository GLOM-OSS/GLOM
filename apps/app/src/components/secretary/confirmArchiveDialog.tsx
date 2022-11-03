import { WarningAmberRounded } from '@mui/icons-material';
import {
  Box,
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

export default function ConfirmArchiveDialog({
  isDialogOpen,
  closeDialog,
  confirm,
  context
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: () => void;
  context: 'archive'|'unarchive'
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'center', columnGap: theme.spacing(0.5)
          }}
        >
          <WarningAmberRounded color="warning" />
          {formatMessage({
            id: 'caution',
          })}
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{formatMessage({id:`${context}Item`})}</DialogContentText>
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
          {formatMessage({ id: context })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
