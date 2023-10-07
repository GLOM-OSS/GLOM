import { ReportRounded } from '@mui/icons-material';
import { Box, Skeleton, Tab, Tabs, Typography } from '@mui/material';
import { getCourse } from '@squoolr/api-services';
import { Course } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import CourseContent from '../../../components/course/courseContent';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import Assessments from '../../../components/assessment';

export default function CourseDetails() {
  const { annual_credit_unit_subject_id } = useParams();
  const { formatMessage } = useIntl();

  const [isCourseLoading, setIsCourseLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<Course>();
  const [courseNotif, setCourseNotif] = useState<useNotification>();

  const loadCourse = (annual_credit_unit_subject_id: string) => {
    setIsCourseLoading(true);
    const notif = new useNotification();
    if (courseNotif) {
      courseNotif.dismiss();
    }
    setCourseNotif(notif);
    getCourse(annual_credit_unit_subject_id)
      .then((course) => {
        setCourse(course);
        setIsCourseLoading(false);
        notif.dismiss();
        setCourseNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingCourse' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadCourse(annual_credit_unit_subject_id)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getCourseFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (annual_credit_unit_subject_id)
      loadCourse(annual_credit_unit_subject_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tabValue, setTabValue] = useState<number>(0);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: 1,
      }}
    >
      <Box sx={{ display: 'grid', rowGap: 1 }}>
        <Typography
          variant="h5"
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            justifyContent: 'start',
            columnGap: 0.6,
          }}
        >
          <Typography variant="h5" component="span" fontWeight={400}>
            {formatMessage({ id: 'courseTitle' })}
            {' : '}
          </Typography>{' '}
          {course ? (
            `${course.subject_code} ${course.subject_title}`
          ) : (
            <Skeleton
              animation="wave"
              width="100px"
              component="span"
              sx={{
                display: 'inline-block',
              }}
            />
          )}
        </Typography>
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
            'courseContent',
            //   'evaluations',
            //   'assignments',
            //   'questionBank',
            'assessment',
          ].map((_, index) => (
            <Tab
              key={index}
              sx={{ textTransform: 'none', fontSize: '1.125rem' }}
              label={formatMessage({ id: _ })}
            />
          ))}
        </Tabs>
      </Box>
      {tabValue === 0 && (
        <CourseContent course={course} isCourseLoading={isCourseLoading} />
      )}
      {tabValue === 1 && <Assessments />}
    </Box>
  );
}
