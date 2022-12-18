import { ReportRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
    CreateWeightingSystem,
    Cycle,
    CycleName,
    CycleType,
    GradeWeighting
} from '@squoolr/interfaces';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import NoCyclesAvailables from '../../components/registry/noCyclesAvailable';
import SelectWeightingSystem from '../../components/registry/selectWeightingSystem';
import WeightingActionBar from '../../components/registry/weightingActionBar';

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
        const newWeightingSystem = undefined;
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
        const newWeightingData: GradeWeighting[] = [];
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
              message={formatMessage({ id: 'getWeightingData' })}
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
  const [isCarryOverDialogOpen, setIsCarryOverDialogOpen] =
    useState<boolean>(false);
  const [isExamAccessDialogOpen, setIsExamAccessDialogOpen] =
    useState<boolean>(false);
  const [isEvaluationWeightingDialogOpen, setIsEvaluationWeightingDialogOpen] =
    useState<boolean>(false);

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
    <Box>
      <WeightingActionBar
        activeCycleId={activeCycle ? activeCycle.cycle_id : ''}
        cycles={cycles}
        weightingSystem={weightingSystem}
        isDataLoading={areWeightingDataLoading || isCreatingWeightingSystem}
        swapActiveCycle={(newCycleId: string) =>
          setActiveCycle(cycles.find(({ cycle_id: cid }) => cid === newCycleId))
        }
        editWeightingSystem={createWeightingSystem}
        openCarryOverDialog={() => setIsCarryOverDialogOpen(true)}
        openEvaluationWeightingDialog={() =>
          setIsEvaluationWeightingDialogOpen(true)
        }
        openExamAccessDialog={() => setIsExamAccessDialogOpen(true)}
      />
    </Box>
  );
}
