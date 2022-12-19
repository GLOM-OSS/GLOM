import { AddRounded, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Fab,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import {
  CarryOverSystem,
  CreateGradeWeighting,
  CreateWeightingSystem,
  Cycle,
  CycleName,
  CycleType,
  EvaluationTypeWeighting, GradeWeighting,
  SemesterExamAccess
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { RowMenu } from '../../components/coordinator/CreditUnitLane';
import CarryOverDialog from '../../components/registry/carryOverDialog';
import EvaluationWeightingDialog from '../../components/registry/evaluationWeightingDialog';
import ExamAccessDialog from '../../components/registry/examAccessDialog';
import NoCyclesAvailables from '../../components/registry/noCyclesAvailable';
import SelectWeightingSystem from '../../components/registry/selectWeightingSystem';
import WeightingActionBar from '../../components/registry/weightingActionBar';
import WeightingDialog from '../../components/registry/weightingDialog';
import WeightingLane, {
  AbsenceWeighting,
  WeightingSkeleton
} from '../../components/registry/weightingLane';

export default function WeightingTable() {
  const { formatMessage } = useIntl();

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [areCyclesLoading, setAreCyclesLoading] = useState<boolean>(false);
  const [cycleNotif, setCycleNotif] = useState<useNotification>();
  const [activeCycle, setActiveCycle] = useState<Cycle>();

  const loadCycles = () => {
    setAreCyclesLoading(true);
    const notif = new useNotification();
    if (cycleNotif) {
      cycleNotif.dismiss();
    }
    setCycleNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load school's offered cycle here
      if (6 > 5) {
        const newCycles: Cycle[] = [
          {
            cycle_id: 'weils',
            cycle_name: CycleName.BACHELOR,
            cycle_type: CycleType.LONG,
            number_of_years: 3,
          },
          {
            cycle_id: 'weisls',
            cycle_name: CycleName.MASTER,
            cycle_type: CycleType.SHORT,
            number_of_years: 2,
          },
        ];

        setCycles(newCycles);
        if (newCycles.length > 0)
          setActiveCycle(
            newCycles.sort((a, b) =>
              a.cycle_type < b.cycle_type
                ? 1
                : a.cycle_name > b.cycle_name
                ? 1
                : -1
            )[0]
          );
        setAreCyclesLoading(false);
        notif.dismiss();
        setCycleNotif(undefined);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingCycles' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCycles}
              notification={notif}
              message={formatMessage({ id: 'getCyclesFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [weightingSystem, setWeightingSystem] = useState<number>();
  const [isWeightingSystemLoading, setIsWeightingSystemLoading] =
    useState<boolean>(false);
  const [weightingSystemNotif, setWeightingSystemNotif] =
    useState<useNotification>();

  const loadWeightingSystem = () => {
    setIsWeightingSystemLoading(true);
    const notif = new useNotification();
    if (weightingSystemNotif) {
      weightingSystemNotif.dismiss();
    }
    setCycleNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load activeCycle's weighting system
      if (6 > 5) {
        const newWeightingSystem = 4;
        setWeightingSystem(newWeightingSystem);
        setIsWeightingSystemLoading(false);
        notif.dismiss();
        setWeightingSystemNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingWeightingSystem' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadWeightingSystem}
              notification={notif}
              message={formatMessage({ id: 'getWeightingSystem' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [weightingData, setWeightingData] = useState<GradeWeighting[]>([]);
  const [areWeightingDataLoading, setAreWeightingDataLoading] =
    useState<boolean>(false);
  const [weightingDataNotif, setWeightingDataNotif] =
    useState<useNotification>();

  const loadWeightingData = () => {
    setAreWeightingDataLoading(true);
    const notif = new useNotification();
    if (weightingDataNotif) {
      weightingDataNotif.dismiss();
    }
    setWeightingDataNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load weightingData with data activeCycle
      if (6 > 5) {
        const newWeightingData: GradeWeighting[] = [
          {
            annual_grade_weighting_id: 'weils',
            grade_value: 'A+',
            maximum: 4,
            minimum: 1,
            observation: 'Toutes les ue',
            point: 4,
            cycle_id: '',
            grade_id: 'lsi',
          },
        ];
        setWeightingData(newWeightingData);
        setAreWeightingDataLoading(false);
        notif.dismiss();
        setWeightingDataNotif(undefined);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingWeightingData' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadWeightingData}
              notification={notif}
              message={formatMessage({ id: 'getWeightingDataFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadCycles();
    return () => {
      //TODO: cleanup axios fetch above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeCycle) {
      loadWeightingSystem();
    }
    return () => {
      //TODO: cleanup axios fetch above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCycle]);

  useEffect(() => {
    if (weightingSystem) {
      loadWeightingData();
    }
    return () => {
      //TODO: cleanup axios fetch above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightingSystem]);

  const [isCreatingWeightingSystem, setIsCreatingWeightingSystem] =
    useState<boolean>(false);

  const createWeightingSystem = (newWeightingSystem: CreateWeightingSystem) => {
    setIsCreatingWeightingSystem(true);
    const notif = new useNotification();
    if (weightingSystemNotif) weightingSystemNotif.dismiss();
    setWeightingSystemNotif(notif);
    notif.notify({ render: formatMessage({ id: 'savingWeightingSystem' }) });
    setTimeout(() => {
      //TODO: CALL API HERE TO createWeighting system with data newWeightingSystem
      if (5 > 4) {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
        setIsCreatingWeightingSystem(false);
        setWeightingSystem(newWeightingSystem.weighting_system);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createWeightingSystem(newWeightingSystem)}
              notification={notif}
              message={formatMessage({ id: 'saveWeightingSystemFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isEditingWeighting, setIsEditingWeighting] = useState<boolean>(false);
  const [weightingNotif, setWeightingNotif] = useState<useNotification>();
  const editWeightingData = (weighting: GradeWeighting) => {
    setIsEditingWeighting(true);
    const notif = new useNotification();
    if (weightingNotif) weightingNotif.dismiss();
    setWeightingNotif(notif);
    notif.notify({ render: formatMessage({ id: 'savingWeighting' }) });
    if (actionnedWeighting) {
      setTimeout(() => {
        //TODO: CALL API HERE TO edit createWeighting with data weighting
        if (5 > 4) {
          notif.update({
            render: formatMessage({ id: 'savedSuccessfully' }),
          });
          setIsEditingWeighting(false);
          setWeightingData(
            weightingData.map((gradeWeighting) => {
              const { annual_grade_weighting_id: agw_id } = gradeWeighting;
              if (agw_id === actionnedWeighting.annual_grade_weighting_id)
                return weighting;
              return gradeWeighting;
            })
          );
          setActionnedWeighting(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => editWeightingData(weighting)}
                notification={notif}
                message={formatMessage({ id: 'saveWeightingFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      if (activeCycle) {
        setTimeout(() => {
          const newWeighting: CreateGradeWeighting = {
            cycle_id: activeCycle.cycle_id,
            grade_id: weighting.grade_id,
            maximum: weighting.maximum,
            minimum: weighting.minimum,
            observation: weighting.observation,
            point: weighting.point,
          };
          //TODO: CALL API HERE TO createWeighting with data newWeighting
          if (5 > 4) {
            notif.update({
              render: formatMessage({ id: 'savedSuccessfully' }),
            });
            setIsEditingWeighting(false);
            //TODO: Put repsonse data after creation here
            const responseWeighting: GradeWeighting = {
              ...newWeighting,
              annual_grade_weighting_id: 'lsi',
              grade_value: 'A+',
            };
            setWeightingData([responseWeighting, ...weightingData]);
            setActionnedWeighting(undefined);
          } else {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() => editWeightingData(weighting)}
                  notification={notif}
                  message={formatMessage({ id: 'saveWeightingFailed' })}
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          }
        }, 3000);
      } else {
        const theNotif = new useNotification();
        theNotif.notify({
          render: formatMessage({ id: 'notifyingCycleAbsence' }),
        });
        theNotif.update({
          type: 'ERROR',
          render: formatMessage({ id: 'cycleDoesNotExist' }),
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }
  };

  const [isDeletingWeighting, setIsDeletingWeighting] =
    useState<boolean>(false);
  const deleteWeighting = (weighting: GradeWeighting) => {
    setIsDeletingWeighting(true);
    const notif = new useNotification();
    if (weightingNotif) weightingNotif.dismiss();
    setWeightingNotif(notif);
    notif.notify({ render: formatMessage({ id: 'deleingWeighting' }) });
    setTimeout(() => {
      //TODO: CALL API HERE TO deleting weighting with data weighting
      if (5 > 4) {
        notif.update({
          render: formatMessage({ id: 'deletedSuccessfully' }),
        });
        setIsDeletingWeighting(false);
        setWeightingData(
          weightingData.filter(
            ({ annual_grade_weighting_id: agw_id }) =>
              agw_id !== weighting.annual_grade_weighting_id
          )
        );
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => deleteWeighting(weighting)}
              notification={notif}
              message={formatMessage({ id: 'deleteWeightingFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isSubmittingDialogData, setIsSubmittingDialogData] =
    useState<boolean>(false);
  const [dialogNotif, setDialogNotif] = useState<useNotification>();
  const submitCarryOverSystem = (carryOverSystem: CarryOverSystem) => {
    setIsSubmittingDialogData(true);
    const notif = new useNotification();
    if (dialogNotif) dialogNotif.dismiss();
    setDialogNotif(notif);
    notif.notify({ render: formatMessage({ id: 'savingCarryOverSystem' }) });
    setTimeout(() => {
      //TODO: CALL API HERE TO edit carryOverSystem with data carryOverSystem
      if (5 > 4) {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
        setIsSubmittingDialogData(false);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => submitCarryOverSystem(carryOverSystem)}
              notification={notif}
              message={formatMessage({ id: 'savingCarryOverSystemFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const submitExamAccesses = (examAccess: SemesterExamAccess[]) => {
    setIsSubmittingDialogData(true);
    const notif = new useNotification();
    if (dialogNotif) dialogNotif.dismiss();
    setDialogNotif(notif);
    notif.notify({ render: formatMessage({ id: 'savingExamAccesses' }) });
    setTimeout(() => {
      //TODO: CALL API HERE TO edit examAccess with data examAccess
      if (5 > 4) {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
        setIsSubmittingDialogData(false);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => submitExamAccesses(examAccess)}
              notification={notif}
              message={formatMessage({ id: 'savingExamAccessesFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };
  const submitEvaluationWeighting = (examAccess: {
    evaluationWeighting: EvaluationTypeWeighting;
    cycle_id: string;
  }) => {
    const { cycle_id, evaluationWeighting } = examAccess;
    setIsSubmittingDialogData(true);
    const notif = new useNotification();
    if (dialogNotif) dialogNotif.dismiss();
    setDialogNotif(notif);
    notif.notify({
      render: formatMessage({ id: 'savingEvaluationWeighting' }),
    });
    setTimeout(() => {
      //TODO: CALL API HERE TO edit evaluationWeighting with data evaluationWeighting for cycle cycle_id
      if (5 > 4) {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
        setIsSubmittingDialogData(false);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => submitEvaluationWeighting(examAccess)}
              notification={notif}
              message={formatMessage({ id: 'savingEvaluationWeighting' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isCarryOverDialogOpen, setIsCarryOverDialogOpen] =
    useState<boolean>(false);
  const [isExamAccessDialogOpen, setIsExamAccessDialogOpen] =
    useState<boolean>(false);
  const [isEvaluationWeightingDialogOpen, setIsEvaluationWeightingDialogOpen] =
    useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [actionnedWeighting, setActionnedWeighting] =
    useState<GradeWeighting>();

  if (!areCyclesLoading && cycles.length === 0) return <NoCyclesAvailables />;

  if (!areCyclesLoading && !isWeightingSystemLoading && !weightingSystem)
    return (
      <SelectWeightingSystem
        activeCycleId={activeCycle ? activeCycle.cycle_id : ''}
        cycles={cycles}
        handleSubmit={createWeightingSystem}
        isDataLoading={isCreatingWeightingSystem}
      />
    );

  return (
    <>
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        deleteItem={() => setIsConfirmDeleteDialogOpen(true)}
        editItem={() => setIsEditDialogOpen(true)}
      />
      <CarryOverDialog
        closeDialog={() => setIsCarryOverDialogOpen(false)}
        handleSubmit={submitCarryOverSystem}
        isDialogOpen={isCarryOverDialogOpen}
      />
      <ExamAccessDialog
        closeDialog={() => setIsExamAccessDialogOpen(false)}
        isDialogOpen={isExamAccessDialogOpen}
        handleSubmit={submitExamAccesses}
      />
      <EvaluationWeightingDialog
        closeDialog={() => setIsEvaluationWeightingDialogOpen(false)}
        isDialogOpen={isEvaluationWeightingDialogOpen}
        cycles={cycles}
        activeCycle={activeCycle?.cycle_id}
        handleSubmit={submitEvaluationWeighting}
      />
      <WeightingDialog
        closeDialog={() => setIsEditDialogOpen(false)}
        handleSubmit={editWeightingData}
        isDialogOpen={isEditDialogOpen}
        weightingSystem={weightingSystem ?? 0}
        editableWeighting={actionnedWeighting}
      />
      <ConfirmDeleteDialog
        closeDialog={() => setIsConfirmDeleteDialogOpen(false)}
        confirm={() =>
          actionnedWeighting
            ? deleteWeighting(actionnedWeighting)
            : alert(formatMessage({ id: 'noActionnedWeightingPresent' }))
        }
        deleteMessage={formatMessage({ id: 'confirmDeleteWeighting' })}
        isDialogOpen={isConfirmDeleteDialogOpen}
      />
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: theme.spacing(1),
        }}
      >
        <WeightingActionBar
          activeCycleId={activeCycle ? activeCycle.cycle_id : ''}
          cycles={cycles}
          weightingSystem={weightingSystem}
          isDataLoading={
            areWeightingDataLoading ||
            isCreatingWeightingSystem ||
            isEditingWeighting ||
            isDeletingWeighting ||
            areCyclesLoading ||
            isWeightingSystemLoading ||
            isSubmittingDialogData
          }
          swapActiveCycle={(newCycleId: string) =>
            setActiveCycle(
              cycles.find(({ cycle_id: cid }) => cid === newCycleId)
            )
          }
          editWeightingSystem={createWeightingSystem}
          openCarryOverDialog={() => setIsCarryOverDialogOpen(true)}
          openEvaluationWeightingDialog={() =>
            setIsEvaluationWeightingDialogOpen(true)
          }
          openExamAccessDialog={() => setIsExamAccessDialogOpen(true)}
        />
        <Box sx={{ position: 'relative', height: '100%' }}>
          <Fab
            disabled={
              areWeightingDataLoading ||
              isCreatingWeightingSystem ||
              isWeightingSystemLoading ||
              areCyclesLoading ||
              isEditDialogOpen ||
              isEditingWeighting ||
              isDeletingWeighting
            }
            onClick={() => setIsEditDialogOpen(true)}
            color="primary"
            sx={{ position: 'absolute', bottom: 16, right: 24 }}
          >
            <Tooltip arrow title={formatMessage({ id: `newSubject` })}>
              <AddRounded />
            </Tooltip>
          </Fab>

          <Scrollbars autoHide>
            <Table sx={{ minWidth: 650 }}>
              <TableHead
                sx={{
                  backgroundColor: lighten(theme.palette.primary.light, 0.6),
                }}
              >
                <TableRow>
                  {['number', 'minimum', 'maximum', 'grade', 'point'].map(
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
                {areWeightingDataLoading ||
                areCyclesLoading ||
                isWeightingSystemLoading ? (
                  [...new Array(10)].map((_, index) => (
                    <WeightingSkeleton key={index} />
                  ))
                ) : weightingData.length === 0 ? (
                  <TableRow
                    sx={{
                      borderBottom: `1px solid ${theme.common.line}`,
                      borderTop: `1px solid ${theme.common.line}`,
                      padding: `0 ${theme.spacing(4.625)}`,
                    }}
                  >
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ textAlign: 'center' }}
                    >
                      {formatMessage({ id: 'noWeightingsYet' })}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {weightingData.map((weighting, index) => (
                      <WeightingLane
                        setAnchorEl={setAnchorEl}
                        weighting={weighting}
                        getActionnedWeighting={setActionnedWeighting}
                        key={index}
                        position={index + 1}
                        isSubmitting={isCreatingWeightingSystem}
                      />
                    ))}
                    <AbsenceWeighting position={weightingData.length + 1} />
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbars>
        </Box>
      </Box>
    </>
  );
}
