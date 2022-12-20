import { ReportRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { getCarryOverSystem } from '@squoolr/api-services';
import { DialogTransition } from '@squoolr/dialogTransition';
import { CarryOver, CarryOverSystem } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function CarryOverDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: CarryOverSystem) => void;
  closeDialog: () => void;
}) {
  const { formatMessage } = useIntl();

  const [isWeightingSystemLoading, setIsCarryOverSystemLoading] =
    useState<boolean>(false);
  const [carryOverSystemNotif, setCarryOverSystemNotif] =
    useState<useNotification>();
  const [carryOverSystem, setCarryOverSystem] = useState<CarryOverSystem>();

  const initialValues: { carry_over_system: CarryOver } = {
    carry_over_system: carryOverSystem
      ? carryOverSystem.carry_over_system
      : CarryOver.SUBJECT,
  };
  const validationSchema = Yup.object().shape({
    carry_over_system: Yup.string().required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: ({ carry_over_system }, { resetForm }) => {
      if (carryOverSystem) {
        handleSubmit({
          carry_over_system,
          annual_carry_over_system_id:
            carryOverSystem.annual_carry_over_system_id,
        });
        resetForm();
        close();
      } else {
        const theNotif = new useNotification();
        theNotif.notify({ render: formatMessage({ id: 'noCarryOverSystem' }) });
        theNotif.update({
          type: 'ERROR',
          render: 'noCarryOverSystem',
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    },
  });

  const close = () => {
    closeDialog();
    formik.resetForm();
  };

  const loadCarryOverSystem = () => {
    setIsCarryOverSystemLoading(true);
    const notif = new useNotification();
    if (carryOverSystemNotif) {
      carryOverSystemNotif.dismiss();
    }
    setCarryOverSystemNotif(notif);
    getCarryOverSystem()
      .then((carryOverSystem) => {
        setCarryOverSystem(carryOverSystem);
        setIsCarryOverSystemLoading(false);
        notif.dismiss();
        setCarryOverSystemNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingCarryOverSystem' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCarryOverSystem}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getCarryOverSystemFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (isDialogOpen) {
      loadCarryOverSystem();
    }
    return () => {
      //TODO: CLEANUP FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{formatMessage({ id: 'carryOverSystem' })}</DialogTitle>
        <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
          <DialogContentText>
            {formatMessage({ id: 'carryOverSystemDialogMessage' })}
          </DialogContentText>
          <TextField
            select
            placeholder={formatMessage({ id: 'carry_over_system' })}
            label={formatMessage({ id: 'carry_over_system' })}
            fullWidth
            required
            color="primary"
            disabled={isWeightingSystemLoading}
            {...formik.getFieldProps('carry_over_system')}
            error={
              formik.touched.carry_over_system &&
              Boolean(formik.errors.carry_over_system)
            }
            helperText={
              formik.touched.carry_over_system &&
              formik.errors.carry_over_system
            }
          >
            {['SUBJECT', 'CREDIT_UNIT'].map((carry_over_system, index) => (
              <MenuItem key={index} value={carry_over_system}>
                {formatMessage({ id: carry_over_system })}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="text"
            onClick={close}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            disabled={
              isWeightingSystemLoading ||
              formik.values.carry_over_system ===
                carryOverSystem?.carry_over_system
            }
            type="submit"
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
