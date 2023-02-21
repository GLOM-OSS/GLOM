import { ReportRounded } from '@mui/icons-material';
import { Box, Skeleton, Tab, Tabs, Typography } from '@mui/material';
import { Course } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import CourseContent from 'apps/student/src/components/course/courseContent';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';

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
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD student's courses
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newCourse: Course = {
          annual_credit_unit_subject_id: 'lseoi',
          classroomAcronyms: [],
          has_course_plan: false,
          is_ca_available: false,
          is_exam_available: false,
          is_resit_available: false,
          objective: 'Make it rain',
          subject_code: 'UC0116',
          subject_title: "Introduction a l'algorithmique",
        };
        setCourse(newCourse);
        setIsCourseLoading(false);
        notif.dismiss();
        setCourseNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingCourse' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadCourse(annual_credit_unit_subject_id)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getCourseFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadCourse(annual_credit_unit_subject_id as string);
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
      {tabValue === 1 && <Typography>Assessment loading</Typography>}
    </Box>
  );
}
