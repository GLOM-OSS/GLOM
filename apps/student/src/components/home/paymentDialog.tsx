import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { ICreatePayment } from '@squoolr/interfaces';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export function PaymentDialog({
  isDialogOpen,
  closeDialog,
  confirm,
  totalDue,
  unpaidSemesters,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: (data: ICreatePayment) => void;
  totalDue: number;
  unpaidSemesters: number[];
}) {
  const { formatMessage, formatNumber } = useIntl();

  const [paymentReason, setPaymentReason] = useState<
    'Fee' | 'Registration' | 'Platform'
  >('Fee');
  const [semesters, setSemesters] = useState<number[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const close = () => {
    setAmount(0);
    setSemesters([]);
    setPaymentReason('Fee');
    closeDialog();
  };

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <DialogTitle>
        {formatMessage({
          id: 'payFee',
        })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {formatMessage({ id: 'feePaymentDialogMessage' })}
        </DialogContentText>
        <Box sx={{ display: 'grid', rowGap: 1 }}>
          <FormControl>
            <InputLabel id="paymentReason">
              {formatMessage({ id: 'paymentReason' })}
            </InputLabel>
            <Select
              labelId="paymentReason"
              value={paymentReason}
              size="small"
              onChange={(event) =>
                setPaymentReason(
                  event.target.value as 'Platform' | 'Fee' | 'Registration'
                )
              }
              input={
                <OutlinedInput label={formatMessage({ id: 'paymentReason' })} />
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                  },
                },
              }}
            >
              {['fee', 'registration', 'platform'].map((_, index) => (
                <MenuItem key={index} value={_[0].toUpperCase() + _.slice(1)}>
                  {_}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {paymentReason !== 'Platform' ? (
            <TextField
              variant="outlined"
              color="primary"
              type="number"
              size="small"
              value={amount}
              onChange={(event) => {
                const val = Number(event.target.value);
                if (val > 0 && val <= totalDue) setAmount(val);
              }}
            />
          ) : (
            <Box>
              <Typography variant="body2">
                {formatMessage({ id: 'selectSemesters' })}
              </Typography>
              <Box sx={{ display: 'grid', rowGap: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    alignContent: 'start',
                  }}
                >
                  {unpaidSemesters.map((_, index) => (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        alignItems: 'center',
                      }}
                    >
                      <Checkbox
                        key={index}
                        checked={semesters.includes(_)}
                        onClick={() => {
                          if (semesters.includes(_)) {
                            const newSemesters = semesters.filter(
                              (num) => num !== _
                            );
                            setAmount(2000 * newSemesters.length);
                            setSemesters(newSemesters);
                          } else {
                            setAmount(2000 * (semesters.length + 1));
                            setSemesters([...semesters, _]);
                          }
                        }}
                      />
                      <Typography>{_}</Typography>
                    </Box>
                  ))}
                </Box>
                <Typography>
                  {formatMessage({ id: 'totalDue' })}{' '}
                  <Typography variant="h6" fontWeight="bold" component="span">
                    {formatNumber(2000 * semesters.length, {
                      style: 'currency',
                      currency: 'XAF',
                    })}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          color="primary"
          variant="outlined"
          onClick={close}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          color="primary"
          variant="contained"
          disabled={amount === 0}
          onClick={() => {
            const data: ICreatePayment = {
              amount,
              payment_date: new Date(),
              payment_reason: paymentReason,
              semester_number: semesters,
            };
            confirm(data);
            close();
          }}
        >
          {formatMessage({ id: 'payNow' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
