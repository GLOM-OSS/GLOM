import { StaffEntity } from '@glom/data-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useIntl } from 'react-intl';
import ReviewColumn from './ReviewColumn';
import { DialogTransition } from '@glom/components';

export default function StaffDetailsDialog({
  isDialogOpen,
  closeDialog,
  staff,
  handleEdit,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  staff: StaffEntity;
  handleEdit: () => void;
}) {
  const { formatMessage } = useIntl();
  const ELEMENTS = [
    'email',
    'first_name',
    'last_name',
    'phone_number',
    'national_id_number',
    'birthdate',
    'gender',
    'address',
  ];

  return (
    <Dialog
      TransitionComponent={DialogTransition}
      open={isDialogOpen}
      onClose={closeDialog}
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
    >
      <DialogTitle>
        {formatMessage({
          id: staff.roles.includes('CONFIGURATOR')
            ? 'configuratorDetails'
            : 'registryDetails',
        })}
      </DialogTitle>
      <DialogContent>
        <ReviewColumn data={staff} order={ELEMENTS} title="" />
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleEdit}>
            {formatMessage({ id: 'edit' })}
          </Button>
          <Button variant="contained" color="primary" onClick={closeDialog}>
            {formatMessage({ id: 'ok' })}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
