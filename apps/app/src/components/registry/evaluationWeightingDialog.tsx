import { ReportRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { getCycles, getEvaluationTypeWeighting } from '@squoolr/api-services';
import { DialogTransition } from '@squoolr/dialogTransition';
import {
  Cycle, EvaluationType,
  EvaluationTypeWeighting
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import NoCyclesAvailables from './noCyclesAvailable';

export default function EvaluationWeightingDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: {
    evaluationWeighting: EvaluationTypeWeighting;
    cycle_id: string;
  }) => void;
  closeDialog: () => void;
}) {
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

  const [isEvaluationWeightingLoading, setIsEvaluationWeightingLoading] =
    useState<boolean>(false);
  const [evaluationWeightingNotif, setEvaluationWeightingNotif] =
    useState<useNotification>();
  const [evaluationWeighting, setEvaluationWeighting] =
    useState<EvaluationTypeWeighting>();
  const [formikCa, setFormikCa] = useState<number>(0);
  const [formikExam, setFormikExam] = useState<number>(0);

  const initialValues: {
    minimum_modulation_score: number;
    ca: number;
    exam: number;
  } = {
    ca: 40,
    exam: 60,
    minimum_modulation_score: 8,
  };
  const validationSchema = Yup.object().shape({
    minimum_modulation_score: Yup.number()
      .min(0, formatMessage({ id: 'greaterOrEqual0' }))
      .max(20, formatMessage({ id: 'lesserOrEqual20' }))
      .required(formatMessage({ id: 'required' })),
    ca: Yup.number()
      .min(100 - formikExam, formatMessage({ id: 'greaterOrEqual0' }))
      .max(100 - formikExam, formatMessage({ id: 'lesserOrEqual100' }))
      .required(formatMessage({ id: 'required' })),
    exam: Yup.number()
      .min(100 - formikCa, formatMessage({ id: 'greaterOrEqual0' }))
      .max(100 - formikCa, formatMessage({ id: 'lesserOrEqual100' }))
      .required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: ({ ca, exam, minimum_modulation_score }, { resetForm }) => {
      if (evaluationWeighting && activeCycleId) {
        handleSubmit({
          evaluationWeighting: {
            minimum_modulation_score,
            evaluationTypeWeightings: [
              { evaluation_type: EvaluationType.CA, weight: ca },
              { evaluation_type: EvaluationType.EXAM, weight: exam },
            ],
          },
          cycle_id: activeCycleId,
        });
        resetForm();
        close();
      } else {
        const theNotif = new useNotification();
        theNotif.notify({
          render: formatMessage({ id: 'noEvaluationWeighting' }),
        });
        theNotif.update({
          type: 'ERROR',
          render: 'noEvaluationWeighting',
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    },
  });

  const close = () => {
    closeDialog();
    formik.resetForm();
  };

  const [adjustedWeighting, setAdjustedWeighting] = useState<{
    minimum_modulation_score: number;
    ca: number;
    exam: number;
  }>();
  const loadEvaluationWeighting = () => {
    setIsEvaluationWeightingLoading(true);
    const notif = new useNotification();
    if (evaluationWeightingNotif) {
      evaluationWeightingNotif.dismiss();
    }
    setEvaluationWeightingNotif(notif);
    getEvaluationTypeWeighting(activeCycleId as string)
      .then((evaluationWeighting) => {
        setEvaluationWeighting(evaluationWeighting);
        const caa = evaluationWeighting.evaluationTypeWeightings.find(
          ({ evaluation_type: et }) => et === EvaluationType.CA
        );
        const exama = evaluationWeighting.evaluationTypeWeightings.find(
          ({ evaluation_type: et }) => et === EvaluationType.EXAM
        );
        const formValues = {
          minimum_modulation_score:
            evaluationWeighting.minimum_modulation_score,
          ca: caa ? caa.weight : 39,
          exam: exama ? exama.weight : 61,
        }
        setAdjustedWeighting(formValues);
        formik.setValues(formValues)
        setIsEvaluationWeightingLoading(false);
        notif.dismiss();
        setEvaluationWeightingNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluationWeighting' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadEvaluationWeighting}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getEvaluationWeightingFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [activeCycleId, setActiveCycleId] = useState<string | undefined>();

  useEffect(() => {
    if (activeCycle) {
      setActiveCycleId(activeCycle.cycle_id);
    } else setActiveCycleId(undefined);
  }, [activeCycle]);

  useEffect(() => {
    if (isDialogOpen && activeCycleId) {
      loadEvaluationWeighting();
    }
    return () => {
      //TODO: CLEANUP FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen, activeCycleId]);

  useEffect(() => {
    if (isDialogOpen) {
      loadCycles();
    }
    return () => {
      //TODO: CLEANUP ABOVE FETCH HERE
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
      {!areCyclesLoading && cycles.length === 0 ? (
        <NoCyclesAvailables />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: theme.spacing(2),
              alignItems: 'center',
              paddingRight: theme.spacing(3),
            }}
          >
            <DialogTitle>
              {formatMessage({ id: 'evaluationWeighting' })}
            </DialogTitle>
            <FormControl>
              <InputLabel id="cycle">
                {formatMessage({ id: 'cycle' })}
              </InputLabel>
              <Select
                size="small"
                labelId="cycle"
                disabled={isEvaluationWeightingLoading || areCyclesLoading}
                onChange={(event) => setActiveCycleId(event.target.value)}
                value={activeCycleId}
                input={<OutlinedInput label={formatMessage({ id: 'cycle' })} />}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8,
                    },
                  },
                }}
              >
                {cycles.map(
                  ({ cycle_id, cycle_name, number_of_years: noy }, index) => (
                    <MenuItem key={index} value={cycle_id}>
                      {`${cycle_name}(${noy} ${formatMessage({
                        id: 'years',
                      })})`}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Box>
          <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
            <DialogContentText>
              {formatMessage({ id: 'evaluationWeightingDialogMessage' })}
            </DialogContentText>
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                columnGap: theme.spacing(2),
                alignItems: 'center',
              }}
            >
              <TextField
                placeholder={formatMessage({ id: 'ca' })}
                label={formatMessage({ id: 'ca' })}
                fullWidth
                required
                color="primary"
                type="number"
                disabled={isEvaluationWeightingLoading || areCyclesLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2">%</Typography>
                    </InputAdornment>
                  ),
                }}
                {...formik.getFieldProps('ca')}
                onChange={(event) => {
                  formik.setFieldValue('ca', event.target.value);
                  setFormikCa(Number(event.target.value));
                }}
                error={formik.touched.ca && Boolean(formik.errors.ca)}
                helperText={formik.touched.ca && formik.errors.ca}
              />
              <TextField
                placeholder={formatMessage({ id: 'exam' })}
                label={formatMessage({ id: 'exam' })}
                fullWidth
                required
                color="primary"
                disabled={isEvaluationWeightingLoading || areCyclesLoading}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2">%</Typography>
                    </InputAdornment>
                  ),
                }}
                {...formik.getFieldProps('exam')}
                onChange={(event) => {
                  formik.setFieldValue('exam', event.target.value);
                  setFormikExam(Number(event.target.value));
                }}
                error={formik.touched.exam && Boolean(formik.errors.exam)}
                helperText={formik.touched.exam && formik.errors.exam}
              />
            </Box>
            <Divider />
            <DialogContentText>
              {formatMessage({ id: 'minimumModulationScoreMessage' })}
            </DialogContentText>
            <TextField
              placeholder={formatMessage({ id: 'minimum_modulation_score' })}
              label={formatMessage({ id: 'minimum_modulation_score' })}
              fullWidth
              required
              color="primary"
              disabled={isEvaluationWeightingLoading || areCyclesLoading}
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2">%</Typography>
                  </InputAdornment>
                ),
              }}
              {...formik.getFieldProps('minimum_modulation_score')}
              error={
                formik.touched.minimum_modulation_score &&
                Boolean(formik.errors.minimum_modulation_score)
              }
              helperText={
                formik.touched.minimum_modulation_score &&
                formik.errors.minimum_modulation_score
              }
            />
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
                isEvaluationWeightingLoading ||
                areCyclesLoading ||
                (formik.values.ca === adjustedWeighting?.ca &&
                  formik.values.exam === adjustedWeighting?.exam &&
                  formik.values.minimum_modulation_score ===
                    adjustedWeighting?.minimum_modulation_score)
              }
              type="submit"
            >
              {formatMessage({ id: 'save' })}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
