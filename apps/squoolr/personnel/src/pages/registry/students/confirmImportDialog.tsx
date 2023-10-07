import { FileDownloadOutlined } from '@mui/icons-material';
import {
  Box,
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

export default function ConfirmImportDialog({
  isDialogOpen,
  closeDialog,
  confirm,
  dialogMessage,
  dialogTitle = 'Confirm ',
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: (files: FileList) => void;
  dialogMessage: string | JSX.Element;
  dialogTitle?: string;
}) {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
      sx={{
        '.MuiPaper-root': {
          backgroundColor: theme.common.dialogBackground,
        },
      }}
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            textTransform: 'none',
          }}
          color={'primary'}
          variant={'text'}
          onClick={closeDialog}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Box>
          <input
            id="add-image-button"
            accept=".csv"
            type="file"
            hidden
            onChange={(event) => {
              confirm(event.target.files as FileList);
            }}
          />
          <label htmlFor="add-image-button">
            <Button
              component="span"
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
              //   disabled={
              //     isImporting ||
              //     areMajorsLoading ||
              //     !activeMajorId ||
              //     areClassroomsLoading
              //   }
              endIcon={<FileDownloadOutlined />}
            >
              {formatMessage({ id: 'selectFile' })}
            </Button>
          </label>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
