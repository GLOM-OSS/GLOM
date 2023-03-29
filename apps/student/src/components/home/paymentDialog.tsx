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
import { ICreatePayment, IFeeSummary } from '@squoolr/interfaces';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { v4 } from 'uuid';

export type IPaymentReason = 'Fee' | 'Registration' | 'Platform';

export function PaymentDialog({
  isDialogOpen,
  closeDialog,
  confirm,
  feeSummary,
  unpaidSemesters,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  feeSummary: IFeeSummary;
  confirm: (data: ICreatePayment) => void;
  unpaidSemesters: number[];
}) {
  const { formatMessage, formatNumber } = useIntl();

  const totalDue = feeSummary?.total_due - feeSummary?.registration;
  const [paymentReason, setPaymentReason] = useState<IPaymentReason>(
    getPaymentReasons()[0]
  );
  const [semesters, setSemesters] = useState<number[]>([]);
  const [amount, setAmount] = useState<number>(
    paymentReason === 'Registration'
      ? (feeSummary?.registration as number)
      : totalDue
  );

  useEffect(() => {
    payAllHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentReason]);

  const close = () => {
    setAmount(0);
    setSemesters([]);
    setPaymentReason(getPaymentReasons()[0]);
    closeDialog();
  };

  function getPaymentReasons() {
    const { registration, total_owing, paymentHistories } = feeSummary;
    const returnArray: IPaymentReason[] = [];
    if (unpaidSemesters.length > 0) {
      returnArray.push('Platform');
    }
    const isRegistrationPaid = Boolean(
      paymentHistories.find((_) => _.payment_reason === 'Registration')
    );
    if (!isRegistrationPaid) returnArray.push('Registration');
    if ((isRegistrationPaid ? total_owing : total_owing - registration) > 0) {
      returnArray.push('Fee');
    }

    return returnArray;
  }

  function getTotalPaymentReasonDue() {
    switch (paymentReason) {
      case 'Fee':
        return totalDue - unpaidSemesters.length * 2000;
      case 'Platform':
        return unpaidSemesters.length * 2000;
      case 'Registration':
        return feeSummary.registration;
    }
  }

  function payAllHandler() {
    setAmount(getTotalPaymentReasonDue());
    if (paymentReason === 'Platform') setSemesters(unpaidSemesters);
  }

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
      <DialogContent sx={{ display: 'grid', rowGap: 3 }}>
        <DialogContentText>
          {formatMessage({ id: 'feePaymentDialogMessage' })}
        </DialogContentText>
        <Box sx={{ display: 'grid', rowGap: 1 }}>
          {getTotalPaymentReasonDue() > amount && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                columnGap: 2,
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  columnGap: 1,
                  alignItems: 'center',
                }}
              >
                <Typography>
                  {formatMessage({ id: 'totalDue' })}
                  {': '}
                </Typography>
                <Typography variant="h6" component="span">
                  {formatNumber(getTotalPaymentReasonDue(), {
                    style: 'currency',
                    currency: 'XAF',
                  })}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                color="success"
                sx={{ textTransform: 'none' }}
                onClick={payAllHandler}
              >
                {formatMessage({ id: 'payAll' })}
              </Button>
            </Box>
          )}
          <FormControl>
            <InputLabel id="paymentReason">
              {formatMessage({ id: 'paymentReason' })}
            </InputLabel>
            <Select
              labelId="paymentReason"
              value={paymentReason}
              size="small"
              onChange={(event) =>
                setPaymentReason(event.target.value as IPaymentReason)
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
              {getPaymentReasons()
                .sort()
                .map((_, index) => (
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
                if (
                  val > 0 &&
                  val <=
                    (paymentReason === 'Fee'
                      ? totalDue
                      : feeSummary.registration)
                )
                  setAmount(val);
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
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Typography>
                    {formatMessage({ id: 'totalPaying' })}
                    {': '}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" component="span">
                    {formatNumber(2000 * semesters.length, {
                      style: 'currency',
                      currency: 'XAF',
                    })}
                  </Typography>
                </Box>
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
              transaction_id: v4(),
              payment_date: new Date(),
              payment_reason: paymentReason,
              semesterNumbers: semesters,
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
