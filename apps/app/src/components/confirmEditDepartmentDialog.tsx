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

export default function ConfirmEditDialog({
  isDialogOpen,
  closeDialog,
  confirmEdit,
  createNewAcademicItem,
  usage,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirmEdit: () => void;
  createNewAcademicItem: () => void;
  usage: 'department' | 'major' | 'classroom';
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
            alignItems: 'center',
            columnGap: theme.spacing(0.5),
          }}
        >
          <WarningAmberRounded color="warning" />
          {formatMessage({
            id: 'caution',
          })}
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{`${formatMessage({
          id: 'editAcademicItemWarning1',
        })} ${formatMessage({ id: usage })} ${formatMessage({
          id: 'editAcademicItemWarning2',
        })}`}</DialogContentText>
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
          variant="outlined"
          onClick={() => {
            confirmEdit();
            closeDialog();
          }}
        >
          {formatMessage({ id: 'continueEditing' })}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          color="primary"
          variant="contained"
          onClick={() => {
            createNewAcademicItem();
            closeDialog();
          }}
        >
          {formatMessage({ id: `addNew${usage[0].toUpperCase()}${usage.slice(1,undefined)}` })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
