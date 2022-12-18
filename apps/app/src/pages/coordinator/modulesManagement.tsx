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
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
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
    setTimeout(() => {
      //TODO: call api here to load creditUnits with data selectedMajor and selectedSemester
      if (6 > 5) {
        const newCreditUnits: CreditUnit[] = [
          {
            annual_credit_unit_id: 'hhes',
            credit_points: 10,
            credit_unit_code: 'UCD0014',
            credit_unit_name: 'Informatique',
            major_id: 'iwld',
            semester_number: 4,
          },
        ];
        setCreditUnits(newCreditUnits);
        setAreCreditUnitsLoading(false);
        notif.dismiss();
        setCreditUnitNotif(undefined);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingCreditUnits' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCreditUnits}
              notification={notif}
              message={formatMessage({ id: 'getCreditUnitsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD MAJORS OF THE COORDINATOR
      if (6 > 5) {
        const newMajors: UEMajor[] = [
          { major_id: 'iwld', major_name: 'IRT', number_of_years: 2 },
          { major_id: 'slsls', major_name: 'IMB', number_of_years: 3 },
        ];
        setMajors(newMajors);
        setAreMajorsLoading(false);
        notif.dismiss();
        setMajorNotif(undefined);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingMajors' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajors}
              notification={notif}
              message={formatMessage({ id: 'getMajorsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
  }, [selectedSemester, selectedMajor]);

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

  const deleteCreditUnit = (creditUnit: CreditUnit) => {
    if (actionnedCreditUnit) {
      setIsManagingCreditUnit(true);
      const notif = new useNotification();
      if (manageNotif) manageNotif.dismiss();
      setManageNotif(notif);
      notif.notify({ render: formatMessage({ id: 'deletingCreditUnit' }) });
      setTimeout(() => {
        //TODO: CALL API HERE TO DELETE CREDIT UNIT WITH DATA creditUnit.annual_credit_unit_id
        if (5 > 4) {
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
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => deleteCreditUnit(creditUnit)}
                notification={notif}
                message={formatMessage({ id: 'deleteCreditUnitFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  const manageCreditUnit = (creditUnit: CreditUnit) => {
    setIsManagingCreditUnit(true);
    const notif = new useNotification();
    if (manageNotif) manageNotif.dismiss();
    setManageNotif(notif);
    if (actionnedCreditUnit) {
      notif.notify({ render: formatMessage({ id: 'editingCreditUnit' }) });
      setTimeout(() => {
        //TODO: CALL API HERE TO edit CREDIT UNIT WITH DATA creditUnit
        if (5 > 4) {
          notif.update({
            render: formatMessage({ id: 'editedSuccessfully' }),
          });
          setIsManagingCreditUnit(false);
          setCreditUnits([
            ...creditUnits.filter(
              ({ annual_credit_unit_id: acu }) =>
                acu !== creditUnit.annual_credit_unit_id
            ),
            creditUnit,
          ]);
          setActionnedCreditUnit(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageCreditUnit(creditUnit)}
                notification={notif}
                message={formatMessage({ id: 'editCreditUnitFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      notif.notify({ render: formatMessage({ id: 'creatingCreditUnit' }) });
      setTimeout(() => {
        //TODO: CALL API HERE TO create CREDIT UNIT WITH DATA creditUnit as CreateCreditUnit
        if (5 > 4) {
          notif.update({
            render: formatMessage({ id: 'createdSuccessfully' }),
          });
          setIsManagingCreditUnit(false);
          //TODO: PUT NEW CREDIT UNIT IN HERE
          const newCreditUnit: CreditUnit = {
            ...creditUnit,
            annual_credit_unit_id: 'eisl',
          };
          setCreditUnits([...creditUnits, newCreditUnit]);
          setActionnedCreditUnit(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageCreditUnit(creditUnit)}
                notification={notif}
                message={formatMessage({ id: 'createCreditUnitFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
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
          actionnedCreditUnit ? deleteCreditUnit(actionnedCreditUnit) : null
        }
        deleteMessage={formatMessage({ id: 'confirmDeleteCreditUnitMessage' })}
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
