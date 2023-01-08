import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  lighten,
  Skeleton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Assessment, AssessmentStatistics } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Graph from './graph';

export default function Statistics({
  onClose,
  activeAssessment,
}: {
  onClose: () => void;
  activeAssessment: Assessment;
}) {
  const { formatMessage } = useIntl();

  const [markInterval, setMarkInterval] = useState<number>(2);
  const [usageGraphData, setUsageGraphData] = useState<AssessmentStatistics>({
    average_score: 0,
    best_score: 0,
    distribution_interval: 2,
    scoreDistributions: [],
    total_number_of_students: 0,
    worst_score: 0,
  });

  const [isGraphDataLoading, setIsGraphDataLoading] = useState(false);
  const [graphNotif, setGraphNotif] = useState<useNotification>();

  const loadGraphData = (
    activeAssessment: Assessment,
    markInterval: number
  ) => {
    setIsGraphDataLoading(true);
    const notif = new useNotification();
    if (graphNotif) {
      graphNotif.dismiss();
    }
    setGraphNotif(notif);
    setTimeout(() => {
      // TODO: CALL API TO GET assessment statistics with data activeAssessment and markInterval
      if (6 > 5) {
        const newUsageData: AssessmentStatistics = {
          average_score: 15,
          best_score: 17,
          distribution_interval: 2,
          total_number_of_students: 50,
          worst_score: 7,
          scoreDistributions: [
            {
              average_score: 0,
              number_of_students: 3,
            },
            {
              average_score: 2,
              number_of_students: 3,
            },
            {
              average_score: 4,
              number_of_students: 3,
            },
            {
              average_score: 6,
              number_of_students: 6,
            },
            {
              average_score: 8,
              number_of_students: 10,
            },
            {
              average_score: 10,
              number_of_students: 8,
            },
            {
              average_score: 12,
              number_of_students: 6,
            },
            {
              average_score: 14,
              number_of_students: 16,
            },
            {
              average_score: 16,
              number_of_students: 17,
            },
            {
              average_score: 18,
              number_of_students: 10,
            },
            {
              average_score: 20,
              number_of_students: 5,
            },
          ],
        };
        setUsageGraphData(newUsageData);
        setIsGraphDataLoading(false);
        notif.dismiss();
        setGraphNotif(undefined);
      } else {
        const notif = new useNotification();
        notif.notify({
          render: formatMessage({ id: 'loadingGraphData' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                loadGraphData(activeAssessment, markInterval)
              }
              notification={notif}
              // TODO: message should come from backend api
              message={formatMessage({ id: 'failedLoadingGraphData' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadGraphData(activeAssessment, markInterval);
    return () => {
      //TODO: CLEANUP AXIOS CALL ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markInterval]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr',
        rowGap: theme.spacing(2),
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          columnGap: theme.spacing(2),
        }}
      >
        <Tooltip arrow title={formatMessage({ id: 'back' })}>
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<KeyboardBackspaceOutlined />}
          />
        </Tooltip>
        <Typography variant="h6">
          {formatMessage({ id: 'assessmentStatistics' })}
        </Typography>
        <TextField
          required
          size="small"
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2">
                  {formatMessage({ id: 'interval' })}
                </Typography>
              </InputAdornment>
            ),
          }}
          value={markInterval}
          onChange={(event) => {
            if (Number(event.target.value) > 0)
              setMarkInterval(Number(event.target.value));
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          columnGap: theme.spacing(2),
        }}
      >
        {[
          'total_number_of_students',
          'average_score',
          'best_score',
          'worst_score',
        ].map((_, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: lighten(theme.palette.primary.main, 0.85),
              padding: theme.spacing(1),
              borderRadius: 3,
              display: 'grid',
              justifyItems: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, textTransform: 'uppercase' }}
            >
              {formatMessage({ id: index === 0 ? 'totalSubmissions' : _ })}
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: '200', marginTop: theme.spacing(1) }}
            >
              {isGraphDataLoading ? (
                <Skeleton animation="wave" width={100} />
              ) : usageGraphData ? (
                `${usageGraphData[_ as keyof AssessmentStatistics]} ${
                  index === 0 ? '' : `/ ${activeAssessment.total_mark}`
                }`
              ) : null}
            </Typography>
          </Box>
        ))}
      </Box>

      <Graph
        data={usageGraphData.scoreDistributions}
        isDataLoading={isGraphDataLoading}
      />
    </Box>
  );
}
