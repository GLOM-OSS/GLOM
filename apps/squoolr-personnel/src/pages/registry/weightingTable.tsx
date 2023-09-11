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
  Tooltip,
} from '@mui/material';
import {
  addNewGradeWeighting,
  deleteGradeWeighting,
  getCycles,
  getGradeWeightings,
  getWeightingSystem,
  updateCarryOverSystem,
  updateEvaluationTypeWeighting,
  updateExamAcess,
  updateGradeWeighting,
  updateWeightingSystem,
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import {
  CarryOverSystem,
  CreateWeightingSystem,
  Cycle,
  EvaluationTypeWeighting,
  GradeWeighting,
  SemesterExamAccess,
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
  WeightingSkeleton,
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
    getCycles()
      .then((cycles) => {
        setCycles(cycles);
        if (cycles.length > 0)
          setActiveCycle(
            cycles.sort((a, b) =>
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
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingCycles' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCycles}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getCyclesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
    setWeightingSystemNotif(notif);
    getWeightingSystem()
      .then((weightingSystem) => {
        setWeightingSystem(weightingSystem?.weighting_system);
        setIsWeightingSystemLoading(false);
        notif.dismiss();
        setWeightingSystemNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingWeightingSystem' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadWeightingSystem}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getWeightingSystem' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
    if (activeCycle) {
      setWeightingDataNotif(notif);
      getGradeWeightings(activeCycle.cycle_id)
        .then((weightingData) => {
          setWeightingData(weightingData);
          setAreWeightingDataLoading(false);
          notif.dismiss();
          setWeightingDataNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingWeightingData' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadWeightingData}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'getWeightingDataFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
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
  };

  useEffect(() => {
    loadCycles();
    return () => {
      //TODO: cleanup axios fetches above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadWeightingSystem();
    return () => {
      //TODO: cleanup axios fetch above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCycle]);

  useEffect(() => {
    if (weightingSystem && activeCycle) {
      loadWeightingData();
    }
    return () => {
      //TODO: cleanup axios fetch above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightingSystem, activeCycle]);

  const [isCreatingWeightingSystem, setIsCreatingWeightingSystem] =
    useState<boolean>(false);

  const createWeightingSystemHandler = (
    newWeightingSystem: CreateWeightingSystem
  ) => {
    setIsCreatingWeightingSystem(true);
    const notif = new useNotification();
    if (weightingSystemNotif) weightingSystemNotif.dismiss();
    setWeightingSystemNotif(notif);
    notif.notify({ render: formatMessage({ id: 'savingWeightingSystem' }) });
    updateWeightingSystem(newWeightingSystem)
      .then(() => {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
        setWeightingSystem(newWeightingSystem.weighting_system);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                createWeightingSystemHandler(newWeightingSystem)
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'saveWeightingSystemFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsCreatingWeightingSystem(false));
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
      const { grade_value, annual_grade_weighting_id, ...data } = weighting;
      updateGradeWeighting(actionnedWeighting.annual_grade_weighting_id, data)
        .then(() => {
          notif.update({
            render: formatMessage({ id: 'savedSuccessfully' }),
          });
          setWeightingData(
            weightingData.map((gradeWeighting) => {
              const { annual_grade_weighting_id: agw_id } = gradeWeighting;
              if (agw_id === actionnedWeighting.annual_grade_weighting_id)
                return { ...weighting, grade_value, annual_grade_weighting_id };
              return gradeWeighting;
            })
          );
          setActionnedWeighting(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => editWeightingData(weighting)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'saveWeightingFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsEditingWeighting(false));
    } else {
      if (activeCycle) {
        addNewGradeWeighting({
          cycle_id: activeCycle.cycle_id,
          grade_id: weighting.grade_id,
          maximum: weighting.maximum,
          minimum: weighting.minimum,
          observation: weighting.observation,
          point: weighting.point,
        })
          .then((newGradeWeighting) => {
            notif.update({
              render: formatMessage({ id: 'savedSuccessfully' }),
            });
            setWeightingData([
              {
                ...weighting,
                grade_value: newGradeWeighting.grade_value,
                annual_grade_weighting_id:
                  newGradeWeighting.annual_grade_weighting_id,
              },
              ...weightingData,
            ]);
            setActionnedWeighting(undefined);
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() => editWeightingData(weighting)}
                  notification={notif}
                  message={
                    error?.message ||
                    formatMessage({ id: 'saveWeightingFailed' })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          })
          .finally(() => setIsEditingWeighting(false));
      } else {
        setIsEditingWeighting(false);
        setActionnedWeighting(undefined);
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
    notif.notify({ render: formatMessage({ id: 'deletingWeighting' }) });
    deleteGradeWeighting(weighting.annual_grade_weighting_id)
      .then(() => {
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
      })
      .catch((error) => {
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
      });
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
    updateCarryOverSystem(carryOverSystem)
      .then(() => {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => submitCarryOverSystem(carryOverSystem)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'savingCarryOverSystemFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmittingDialogData(false));
  };

  const submitExamAccesses = (examAccess: SemesterExamAccess[]) => {
    setIsSubmittingDialogData(true);
    const notif = new useNotification();
    if (dialogNotif) dialogNotif.dismiss();
    setDialogNotif(notif);
    notif.notify({ render: formatMessage({ id: 'savingExamAccesses' }) });
    updateExamAcess(examAccess)
      .then(() => {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => submitExamAccesses(examAccess)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'savingExamAccessesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmittingDialogData(false));
  };
  const submitEvaluationWeighting = (newEvaluationWeighting: {
    evaluationWeighting: EvaluationTypeWeighting;
    cycle_id: string;
  }) => {
    const { cycle_id, evaluationWeighting } = newEvaluationWeighting;
    setIsSubmittingDialogData(true);
    const notif = new useNotification();
    if (dialogNotif) dialogNotif.dismiss();
    setDialogNotif(notif);
    notif.notify({
      render: formatMessage({ id: 'savingEvaluationWeighting' }),
    });
    alert(JSON.stringify(evaluationWeighting.evaluationTypeWeightings));
    updateEvaluationTypeWeighting(cycle_id, {
      ...evaluationWeighting,
      evaluationTypeWeightings:
        evaluationWeighting.evaluationTypeWeightings.map(
          ({ evaluation_type, weight }) => ({
            evaluation_type,
            weight: Number(weight),
          })
        ),
    })
      .then(() => {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                submitEvaluationWeighting(newEvaluationWeighting)
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'savingEvaluationWeighting' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmittingDialogData(false));
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
        handleSubmit={createWeightingSystemHandler}
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
        handleSubmit={submitEvaluationWeighting}
      />
      <WeightingDialog
        closeDialog={() => {
          setIsEditDialogOpen(false);
          setActionnedWeighting(undefined);
        }}
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
        dialogMessage={formatMessage({ id: 'confirmDeleteWeighting' })}
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
          activeCycleId={activeCycle?.cycle_id as string}
          cycles={cycles}
          swapActiveCycle={(newCycleId: string) =>
            setActiveCycle(
              cycles.find(({ cycle_id: cid }) => cid === newCycleId)
            )
          }
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
          editWeightingSystem={createWeightingSystemHandler}
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
              isEditDialogOpen ||
              areCyclesLoading ||
              isEditingWeighting ||
              isDeletingWeighting
            }
            onClick={() => setIsEditDialogOpen(true)}
            color="primary"
            sx={{ position: 'absolute', bottom: 16, right: 24 }}
          >
            <Tooltip arrow title={formatMessage({ id: `newWeighting` })}>
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
                    {weightingData
                      .sort((a, b) => b.minimum - a.minimum)
                      .map((weighting, index) => (
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
