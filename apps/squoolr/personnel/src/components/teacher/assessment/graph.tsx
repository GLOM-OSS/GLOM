import { Skeleton } from '@mui/material';
import { ScoreDistribution } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { random } from '@glom/utils';
import Chart, { ChartItem } from 'chart.js/auto';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

export default function Graph({
  data,
  isDataLoading,
}: {
  data: ScoreDistribution[];
  isDataLoading: boolean;
}) {
  const { formatNumber, formatMessage } = useIntl();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = (data: any) => {
    return {
      type: 'line',
      data,
      options: {
        maintainAspectRatio: false,
        tension: 0.2,
        scales: {
          y: {
            stacked: true,
            grid: {
              display: true,
              color: theme.common.line,
            },
          },
          x: {
            grid: {
              display: true,
              color: theme.common.line,
            },
          },
        },
        parsing: {
          xAxisKey: 'average_score',
          yAxisKey: 'number_of_students',
        },
      },
    };
  };

  const updateGraph = () => {
    const dataChart = Chart.getChart('dataChart');
    if (dataChart) dataChart.destroy();

    new Chart(
      document.getElementById('dataChart') as ChartItem,
      config({
        datasets: [
          {
            label: formatMessage({ id: 'assessmentMarkDistribution' }),
            data: data
              .sort((a, b) => (a.average_score > b.average_score ? 1 : -1))
              .map(({ average_score, number_of_students }) => ({
                average_score: formatNumber(average_score),
                number_of_students: formatNumber(number_of_students),
              })),
            borderColor: theme.palette.primary.light,
            fill: true,
            order: 2,
          },
        ],
      })
    );
  };
  useEffect(() => {
    updateGraph();
    // eslint-disable-next-line
  }, [data]);

  return (
    <>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: isDataLoading ? 'none' : 'grid',
        }}
      >
        <canvas id="dataChart"></canvas>
      </div>
      {isDataLoading && (
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            columnGap: theme.spacing(1),
            width: '100%',
            height: '100%',
          }}
        >
          {[...new Array(9)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              animation="wave"
              height={`${random() * 10}%`}
            />
          ))}
        </div>
      )}
    </>
  );
}
