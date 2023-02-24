import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  lighten,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ICreatePayment, IDiscipline, IFeeSummary } from '@squoolr/interfaces';
import { useUser } from '@squoolr/layout';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import {
  NoTableElement,
  TableLaneSkeleton,
} from '../../components/helpers/tables';
import AbsenceLane from '../../components/home/absenceLane';
import PaymentCard from '../../components/home/paymentCard';
import { PaymentDialog } from '../../components/home/paymentDialog';
import StatCard from '../../components/home/statCard';

export default function Home() {
  const { formatMessage, formatNumber } = useIntl();
  const { student } = useUser();

  const [areAbsencesLoading, setAreAbsencesLoading] = useState<boolean>(false);
  const [absences, setAbsences] = useState<IDiscipline[]>([]);
  const [absenceNotif, setAbsenceNotif] = useState<useNotification>();

  const loadAbsences = () => {
    setAreAbsencesLoading(true);
    const notif = new useNotification();
    if (absenceNotif) {
      absenceNotif.dismiss();
    }
    setAbsenceNotif(notif);
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD student's absences
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newAbsences: IDiscipline[] = [];
        setAbsences(newAbsences);
        setAreAbsencesLoading(false);
        notif.dismiss();
        setAbsenceNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingAbsences' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadAbsences()}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getAbsencesFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isFeeSummaryLoading, setIsFeeSummaryLoading] =
    useState<boolean>(false);
  const [feeSummary, setFeeSummary] = useState<IFeeSummary>();
  const [feeNotif, setFeeNotif] = useState<useNotification>();

  const loadFeeSummary = () => {
    setIsFeeSummaryLoading(true);
    const notif = new useNotification();
    if (feeNotif) {
      feeNotif.dismiss();
    }
    setFeeNotif(notif);
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD student's feeSummary
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newFeeSummary: IFeeSummary = {
          paymentHistories: [
            {
              amount: 10000,
              payment_date: new Date(),
              payment_id: 'siel',
              payment_reason: 'Fee',
              semester_number: 2,
            },
            {
              amount: 100000,
              payment_date: new Date(),
              payment_id: 'siels',
              payment_reason: 'Platform',
              semester_number: 2,
            },
            {
              amount: 100000,
              payment_date: new Date(),
              payment_id: 'sieals',
              payment_reason: 'Registration',
              semester_number: 2,
            },
          ],
          total_due: 30000000,
          total_owing: 10000000,
          total_paid: 20000000,
          registration: 100000,
        };
        setFeeSummary(newFeeSummary);
        setIsFeeSummaryLoading(false);
        notif.dismiss();
        setFeeNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingFeeSummary' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadFeeSummary()}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getFeeSummaryFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadAbsences();
    loadFeeSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertSnakeToCamel = (val: string) => {
    return val
      .split('_')
      .map((_, index) => {
        if (index === 0) return _;
        return _[0].toUpperCase() + _.slice(1);
      })
      .join('');
  };

  const [isPaymentdialogOPen, setIsPaymentDialogOpen] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitNotif, setSubmitNotif] = useState<useNotification>();

  const submitPayment = (payment: ICreatePayment) => {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submitNotif) {
      submitNotif.dismiss();
    }
    setSubmitNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'submittingPayment',
      }),
    });
    setTimeout(() => {
      //TODO: CALL API HERE TO submit payment with data payment
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        setIsSubmitting(false);
        notif.update({
          render: formatMessage({
            id: 'paymentSubmissionSuccessfull',
          }),
        });
        setSubmitNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => submitPayment(payment)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({
                id: 'paymentSubmissionFailed',
              })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  return (
    <>
      <PaymentDialog
        closeDialog={() => setIsPaymentDialogOpen(false)}
        isDialogOpen={isPaymentdialogOPen}
        unpaidSemesters={student ? student.activeSemesters : []}
        totalDue={
          feeSummary ? feeSummary.total_due - feeSummary.registration : 0
        }
        confirm={submitPayment}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr',
          columnGap: 2,
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            rowGap: 4,
            height: '100%',
            paddingRight: 2,
            borderRight: `1px solid ${theme.common.line}`,
          }}
        >
          <Box sx={{ display: 'grid', rowGap: 1 }}>
            <Typography variant="h6">
              {formatMessage({ id: 'feeSummary' })}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                columnGap: 2,
              }}
            >
              {['total_due', 'total_paid', 'total_owing'].map((_, index) => (
                <StatCard
                  key={index}
                  title={formatMessage({ id: convertSnakeToCamel(_) })}
                  skeleton={isFeeSummaryLoading || !feeSummary}
                  value={
                    feeSummary
                      ? formatNumber(
                          feeSummary[_ as keyof IFeeSummary] as number,
                          {
                            style: 'currency',
                            currency: 'XAF',
                          }
                        )
                      : undefined
                  }
                />
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'grid',
              rowGap: 1,
              height: '100%',
              gridTemplateRows: 'auto 1fr',
            }}
          >
            <Typography variant="h6">
              {formatMessage({ id: 'discipline' })}
              {areAbsencesLoading ? null : (
                <Typography
                  component="span"
                  variant="h6"
                  color={theme.palette.error.main}
                >
                  {` (${formatNumber(
                    absences.reduce(
                      (total, { absences: duration }) => duration + total,
                      0
                    ),
                    { style: 'unit', unit: 'hour', unitDisplay: 'short' }
                  )} ${formatMessage({ id: 'absences' })})`}
                </Typography>
              )}
            </Typography>
            <Scrollbars autoHide>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead
                  sx={{
                    backgroundColor: lighten(theme.palette.primary.light, 0.6),
                  }}
                >
                  <TableRow>
                    {['date', 'course', 'numberOfHours'].map((val, index) => (
                      <TableCell
                        key={index}
                        align={index === 2 ? 'right' : 'left'}
                      >
                        {formatMessage({ id: val })}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {areAbsencesLoading ? (
                    [...new Array(5)].map((_, index) => (
                      <TableLaneSkeleton cols={3} key={index} />
                    ))
                  ) : absences.length === 0 ? (
                    <NoTableElement
                      message={formatMessage({
                        id: 'noAbsences',
                      })}
                      colSpan={3}
                    />
                  ) : (
                    absences
                      .sort((a, b) =>
                        a.presence_list_date > b.presence_list_date
                          ? 1
                          : a.absences > b.absences
                          ? 1
                          : a.subject_title > b.subject_title
                          ? 1
                          : -1
                      )
                      .map((abs, index) => (
                        <AbsenceLane absence={abs} key={index} />
                      ))
                  )}
                </TableBody>
              </Table>
            </Scrollbars>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'grid',
            height: '100%',
            gridTemplateRows: 'auto 1fr',
            rowGap: 2,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: 2,
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">
              {formatMessage({ id: 'paymentHistory' })}
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => setIsPaymentDialogOpen(true)}
              disabled={isFeeSummaryLoading || !feeSummary || isSubmitting}
            >
              {formatMessage({ id: 'pay' })}
            </Button>
          </Box>
          <Scrollbars autoHide>
            <Box sx={{ display: 'grid', rowGap: 2, alignContent: 'start' }}>
              {isFeeSummaryLoading || !feeSummary
                ? [...new Array(7)].map((_, index) => (
                    <Skeleton height={100} animation="wave" key={index} />
                  ))
                : feeSummary.paymentHistories.map((payment, index) => (
                    <PaymentCard key={index} payment={payment} />
                  ))}
            </Box>
          </Scrollbars>
        </Box>
      </Box>
    </>
  );
}
