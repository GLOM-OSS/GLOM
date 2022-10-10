import { WarningAmberRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function ConfirmResetDialog({
  close,
  handleConfirm,
  isResetPasswordDialogOpen,
  isResetCodeDialogOpen,
  personnel_code,
}: {
  close: () => void;
  handleConfirm: () => void;
  isResetPasswordDialogOpen: boolean;
  isResetCodeDialogOpen: boolean;
  personnel_code: string;
}) {
  const { formatMessage } = useIntl();
  const [entered_code, setEnteredCode] = useState<string>('');
  const closeDialog = () => {
    close();
    setEnteredCode('');
  };
  return (
    <Dialog
      open={isResetPasswordDialogOpen || isResetCodeDialogOpen}
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
            color: theme.palette.warning.main,
          }}
        >
          <WarningAmberRounded color="warning" />
          {formatMessage({
            id: isResetCodeDialogOpen ? 'resetPrivateCode' : 'resetPassword',
          })}
        </Box>
      </DialogTitle>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleConfirm();
          closeDialog();
        }}
      >
        <DialogContent>
          <DialogContentText sx={{ marginBottom: theme.spacing(2) }}>
            {formatMessage({
              id: isResetCodeDialogOpen
                ? 'resetPrivateCodeMessage'
                : 'resetPasswordMessage',
            })}
          </DialogContentText>
          <Typography variant="body2" sx={{ fontWeight: 300 }}>
            {`${formatMessage({
              id: 'confirmPersonnelCode',
            })}: `}
            <Typography
              variant="body2"
              sx={{ fontWeight: 500 }}
              component="span"
            >
              {personnel_code}
            </Typography>
          </Typography>
          <TextField
            autoFocus
            color="warning"
            placeholder={formatMessage({ id: 'enterPersonnelCode' })}
            fullWidth
            required
            value={entered_code}
            onChange={(event) => setEnteredCode(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="warning"
            variant="text"
            onClick={closeDialog}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="outlined"
            type="submit"
            disabled={personnel_code !== entered_code}
          >
            {formatMessage({ id: 'confirm' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
