import { Box, Tab, Tabs } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import Assessments from '../../components/teacher/assessment';
import CAEvaluation from '../../components/teacher/caEvaluation';
import CoursePlan from '../../components/teacher/coursePlan';

export default function CourseDetails() {
  const { formatMessage } = useIntl();
  const [tabValue, setTabValue] = useState<number>(0);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: theme.spacing(3),
      }}
    >
      <Tabs
        value={tabValue}
        variant="scrollable"
        sx={{ borderBottom: `2px solid ${theme.common.line}` }}
        scrollButtons="auto"
        onChange={(_event: React.SyntheticEvent, newValue: number) =>
          setTabValue(newValue)
        }
      >
        {[
          'coursePlan',
          'evaluations',
          'assignments',
          'presences',
          'questionBank',
          'assessment',
        ].map((_, index) => (
          <Tab
            key={index}
            sx={{ textTransform: 'none', fontSize: '1.125rem' }}
            label={formatMessage({ id: _ })}
          />
        ))}
      </Tabs>
      {tabValue === 0 && <CoursePlan />}
      {tabValue === 1 && <CAEvaluation />}
      {tabValue === 5 && <Assessments />}
    </Box>
  );
}
