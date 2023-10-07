import { DoneAllOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  lighten,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  getStudentAbsences,
  getStudentFeeSummary,
  payStudentFee,
} from '@squoolr/api-services';
import { ICreatePayment, IDiscipline, IFeeSummary } from '@squoolr/interfaces';
import { useUser } from '@squoolr/layout';
import { theme } from '@glom/theme';
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
  const { annualStudent } = useUser();
  const { formatMessage, formatNumber } = useIntl();

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
    getStudentAbsences()
      .then((absences) => {
        setAbsences(absences);
        setAreAbsencesLoading(false);
        notif.dismiss();
        setAbsenceNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingAbsences' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadAbsences()}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getAbsencesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [isFeeSummaryLoading, setIsFeeSummaryLoading] =
    useState<boolean>(false);
  const [feeSummary, setFeeSummary] = useState<IFeeSummary>({
    paymentHistories: [],
    registration: 0,
    total_owing: 0,
    total_paid: 0,
    total_due: 0,
  });
  const [feeNotif, setFeeNotif] = useState<useNotification>();

  const loadFeeSummary = () => {
    setIsFeeSummaryLoading(true);
    const notif = new useNotification();
    if (feeNotif) {
      feeNotif.dismiss();
    }
    setFeeNotif(notif);
    getStudentFeeSummary()
      .then((feeSummary) => {
        setFeeSummary(feeSummary);
        setIsFeeSummaryLoading(false);
        notif.dismiss();
        setFeeNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingFeeSummary' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadFeeSummary()}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getFeeSummaryFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
    payStudentFee(payment)
      .then((paymentHistories) => {
        setFeeSummary(({ total_owing, total_paid, ...feeSummary }) => ({
          ...feeSummary,
          total_paid: total_paid + payment.amount,
          total_owing: total_owing - payment.amount,
          paymentHistories: [
            ...feeSummary.paymentHistories,
            ...paymentHistories,
          ],
        }));
        notif.update({
          render: formatMessage({
            id: 'paymentSubmissionSuccessfull',
          }),
        });
        setSubmitNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => submitPayment(payment)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'paymentSubmissionFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <PaymentDialog
        closeDialog={() => setIsPaymentDialogOpen(false)}
        isDialogOpen={isPaymentdialogOPen}
        unpaidSemesters={annualStudent ? annualStudent.activeSemesters : []}
        feeSummary={feeSummary}
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
            {feeSummary &&
            feeSummary.total_owing === 0 &&
            annualStudent &&
            annualStudent.activeSemesters.length === 0 ? (
              <Chip
                color="success"
                icon={<DoneAllOutlined />}
                label={formatMessage({ id: 'solvent' })}
                sx={{
                  backgroundColor: lighten(theme.palette.success.main, 0.4),
                }}
              />
            ) : (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => setIsPaymentDialogOpen(true)}
                disabled={
                  isFeeSummaryLoading ||
                  !feeSummary ||
                  isSubmitting ||
                  !annualStudent
                }
              >
                {formatMessage({ id: 'pay' })}
              </Button>
            )}
          </Box>
          <Scrollbars autoHide>
            <Box sx={{ display: 'grid', rowGap: 2, alignContent: 'start' }}>
              {isFeeSummaryLoading || !feeSummary
                ? [...new Array(7)].map((_, index) => (
                    <Skeleton height={100} animation="wave" key={index} />
                  ))
                : feeSummary.paymentHistories
                    .sort(
                      (a, b) =>
                        new Date(b.payment_date).getTime() -
                        new Date(a.payment_date).getTime()
                    )
                    .map((payment, index) => (
                      <PaymentCard key={index} payment={payment} />
                    ))}
            </Box>
          </Scrollbars>
        </Box>
      </Box>
    </>
  );
}
