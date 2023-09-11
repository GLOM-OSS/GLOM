import { AddRounded, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Fab,
  lighten,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  addNewCreditUnit,
  deleteCreditUnit,
  getCoordinatorMajors,
  getCreditUnits,
  updateCreditUnit,
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/confirm-dialogs';
import { CreditUnit, UEMajor } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import CreditUnitDialog from '../../components/coordinator/creditUnitDialog';
import CreditUnitLane, {
  CreditUnitSkeleton,
  RowMenu,
} from '../../components/coordinator/CreditUnitLane';

export default function ModulesManagement() {
  const { formatMessage } = useIntl();

  const [creditUnits, setCreditUnits] = useState<CreditUnit[]>([]);
  const [areCreditUnitsLoading, setAreCreditUnitsLoading] =
    useState<boolean>(false);
  const [creditUnitNotif, setCreditUnitNotif] = useState<useNotification>();

  const loadCreditUnits = () => {
    setAreCreditUnitsLoading(true);
    const notif = new useNotification();
    if (creditUnitNotif) {
      creditUnitNotif.dismiss();
    }
    setCreditUnitNotif(notif);
    if (majors.length > 0)
      getCreditUnits({
        majorIds: selectedMajor
          ? [{ major_id: selectedMajor.major_id }]
          : majors.map(({ major_id }) => ({ major_id })),
        semester_number: selectedSemester,
      })
        .then((creditUnits) => {
          setCreditUnits(creditUnits);
          setAreCreditUnitsLoading(false);
          notif.dismiss();
          setCreditUnitNotif(undefined);
        })
        .catch((error) => {
          notif.notify({ render: formatMessage({ id: 'loadingCreditUnits' }) });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadCreditUnits}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'getCreditUnitsFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
  };

  const [majors, setMajors] = useState<UEMajor[]>([]);
  const [areMajorsLoading, setAreMajorsLoading] = useState<boolean>(false);
  const [majorNotif, setMajorNotif] = useState<useNotification>();

  const loadMajors = () => {
    setAreMajorsLoading(true);
    const notif = new useNotification();
    if (majorNotif) {
      majorNotif.dismiss();
    }
    setMajorNotif(notif);
    getCoordinatorMajors()
      .then((majors) => {
        setMajors(majors);
        setAreMajorsLoading(false);
        notif.dismiss();
        setMajorNotif(undefined);
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingMajors' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajors}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getMajorsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };
  const [selectedMajor, setSelectedMajor] = useState<UEMajor>();
  const [selectedSemester, setSelectedSemester] = useState<number>();

  useEffect(() => {
    loadMajors();
    return () => {
      //TODO: ABORT PREVIOUS AXIOS FETCH HERE
      console.log('cleanup previous axios fetch here by aborting it');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadCreditUnits();
    return () => {
      //TODO: ABORT PREVIOUS AXIOS FETCH HERE
      console.log('cleanup previous axios fetch here by aborting it');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [majors, selectedSemester, selectedMajor]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [actionnedCreditUnit, setActionnedCreditUnit] = useState<CreditUnit>();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const getActionnedCreditUnit = (creditUnit: CreditUnit) => {
    setActionnedCreditUnit(creditUnit);
  };

  const [isDeletingCreditUnit, setIsManagingCreditUnit] =
    useState<boolean>(false);
  const [manageNotif, setManageNotif] = useState<useNotification>();

  const deleteCreditUnitHandler = (creditUnit: CreditUnit) => {
    if (actionnedCreditUnit) {
      setIsManagingCreditUnit(true);
      const notif = new useNotification();
      if (manageNotif) manageNotif.dismiss();
      setManageNotif(notif);
      notif.notify({ render: formatMessage({ id: 'deletingCreditUnit' }) });
      deleteCreditUnit(creditUnit.annual_credit_unit_id)
        .then(() => {
          notif.update({
            render: formatMessage({ id: 'deletedSuccessfully' }),
          });
          setIsManagingCreditUnit(false);
          setCreditUnits(
            creditUnits.filter(
              ({ annual_credit_unit_id: acu }) =>
                acu !== creditUnit.annual_credit_unit_id
            )
          );
          setActionnedCreditUnit(undefined);
          setIsConfirmDeleteDialogOpen(false);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => deleteCreditUnitHandler(creditUnit)}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'deleteCreditUnitFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    }
  };

  const manageCreditUnit = (creditUnit: CreditUnit) => {
    setIsManagingCreditUnit(true);
    const notif = new useNotification();
    if (manageNotif) manageNotif.dismiss();
    setManageNotif(notif);
    if (actionnedCreditUnit) {
      notif.notify({ render: formatMessage({ id: 'editingCreditUnit' }) });
      const { annual_credit_unit_id, ...updatedCreditUnit } = creditUnit;
      updateCreditUnit(
        actionnedCreditUnit.annual_credit_unit_id,
        updatedCreditUnit
      )
        .then(() => {
          notif.update({
            render: formatMessage({ id: 'editedSuccessfully' }),
          });
          setCreditUnits([
            ...creditUnits.filter(
              ({ annual_credit_unit_id: acu }) =>
                acu !== creditUnit.annual_credit_unit_id
            ),
            creditUnit,
          ]);
          setActionnedCreditUnit(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageCreditUnit(creditUnit)}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'editCreditUnitFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsManagingCreditUnit(false));
    } else {
      notif.notify({ render: formatMessage({ id: 'creatingCreditUnit' }) });
      const { annual_credit_unit_id, ...newCreditUnit } = creditUnit;
      addNewCreditUnit(newCreditUnit)
        .then((newCreditUnit) => {
          notif.update({
            render: formatMessage({ id: 'createdSuccessfully' }),
          });
          setCreditUnits([...creditUnits, newCreditUnit]);
          setActionnedCreditUnit(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageCreditUnit(creditUnit)}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'createCreditUnitFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsManagingCreditUnit(false));
    }
  };

  return (
    <>
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        deleteItem={() => setIsConfirmDeleteDialogOpen(true)}
        editItem={() => setIsEditDialogOpen(true)}
      />
      <CreditUnitDialog
        handleSubmit={(values: CreditUnit) => manageCreditUnit(values)}
        closeDialog={() => {
          setActionnedCreditUnit(undefined);
          setIsEditDialogOpen(false);
        }}
        majors={majors}
        isDialogOpen={isEditDialogOpen}
        editableCreditUnit={actionnedCreditUnit}
      />
      <ConfirmDeleteDialog
        closeDialog={() => {
          setIsConfirmDeleteDialogOpen(false);
          setActionnedCreditUnit(undefined);
        }}
        confirm={() =>
          actionnedCreditUnit
            ? deleteCreditUnitHandler(actionnedCreditUnit)
            : null
        }
        dialogMessage={formatMessage({ id: 'confirmDeleteCreditUnitMessage' })}
        isDialogOpen={isConfirmDeleteDialogOpen}
      />
      <Box
        sx={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%' }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto auto 1fr',
            columnGap: theme.spacing(3),
            marginBottom: theme.spacing(2),
          }}
        >
          <TextField
            select
            size="small"
            placeholder={formatMessage({ id: 'major' })}
            label={formatMessage({ id: 'major' })}
            value={selectedMajor?.major_id}
            color="primary"
            disabled={areMajorsLoading || !majors}
            onChange={(event) => {
              const selectedMajorId = event.target.value;
              setSelectedMajor(
                majors?.find(({ major_id }) => major_id === selectedMajorId)
              );
            }}
            sx={{
              '& input': { ...theme.typography.caption },
              backgroundColor: theme.common.inputBackground,
              minWidth: '200px',
            }}
          >
            <MenuItem value={'all'}>{formatMessage({ id: 'all' })}</MenuItem>
            {majors &&
              majors.map(({ major_name, major_id }, index) => (
                <MenuItem key={index} value={major_id}>
                  {major_name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            select
            size="small"
            placeholder={formatMessage({ id: 'semester' })}
            label={formatMessage({ id: 'semester' })}
            value={selectedSemester}
            color="primary"
            disabled={areMajorsLoading || !majors}
            onChange={(event) => {
              const selectedSemester = event.target.value;
              setSelectedSemester(
                selectedSemester !== 'all'
                  ? Number(selectedSemester)
                  : undefined
              );
            }}
            sx={{
              '& input': { ...theme.typography.caption },
              backgroundColor: theme.common.inputBackground,
              minWidth: '200px',
            }}
          >
            <MenuItem value={'all'}>{formatMessage({ id: 'all' })}</MenuItem>
            {[
              ...new Array(
                selectedMajor ? selectedMajor.number_of_years * 2 : 0
              ),
            ].map((_, index) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ height: '100%', display: 'relative' }}>
          <Scrollbars autoHide>
            <Table sx={{ minWidth: 650 }}>
              <TableHead
                sx={{
                  backgroundColor: lighten(theme.palette.primary.light, 0.6),
                }}
              >
                <TableRow>
                  {['code', 'title', 'numberOfCredits', 'semester'].map(
                    (val, index) => (
                      <TableCell key={index}>
                        {formatMessage({ id: val })}
                      </TableCell>
                    )
                  )}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {areCreditUnitsLoading ? (
                  [...new Array(10)].map((_, index) => (
                    <CreditUnitSkeleton key={index} />
                  ))
                ) : creditUnits.length === 0 ? (
                  <TableRow
                    sx={{
                      borderBottom: `1px solid ${theme.common.line}`,
                      borderTop: `1px solid ${theme.common.line}`,
                      padding: `0 ${theme.spacing(4.625)}`,
                    }}
                  >
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ textAlign: 'center' }}
                    >
                      {formatMessage({ id: 'noCreditUnitsYet' })}
                    </TableCell>
                  </TableRow>
                ) : (
                  creditUnits.map((creditUnit, index) => (
                    <CreditUnitLane
                      setAnchorEl={setAnchorEl}
                      creditUnit={creditUnit}
                      getActionnedCreditUnit={getActionnedCreditUnit}
                      key={index}
                      isSubmitting={isDeletingCreditUnit}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbars>
          <Fab
            disabled={
              areCreditUnitsLoading || isDeletingCreditUnit || isEditDialogOpen
            }
            onClick={() => setIsEditDialogOpen(true)}
            color="primary"
            sx={{ position: 'absolute', bottom: 16, right: 24 }}
          >
            <Tooltip arrow title={formatMessage({ id: `newCreditUnit` })}>
              <AddRounded />
            </Tooltip>
          </Fab>
        </Box>
      </Box>
    </>
  );
}
