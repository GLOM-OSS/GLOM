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

export default function ConfirmEditDepartmentDialog({
  isDialogOpen,
  closeDialog,
  confirmEdit,
  createNewDepartment,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirmEdit: () => void;
  createNewDepartment: () => void;
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
        <DialogContentText>{formatMessage({id:'editDepartmentWarning'})}</DialogContentText>
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
            createNewDepartment();
            closeDialog();
          }}
        >
          {formatMessage({ id: 'addNewDepartment' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
