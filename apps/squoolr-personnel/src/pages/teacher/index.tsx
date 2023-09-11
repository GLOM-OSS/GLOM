import { ReportRounded } from '@mui/icons-material';
import {
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { getCourses } from '@squoolr/api-services';
import { Course } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import {
  CourseLane,
  TableLaneSkeleton,
} from '../../components/teacher/courseLane';

export default function TeacherCourses() {
  const { formatMessage } = useIntl();
  const [courses, setCourses] = useState<Course[]>([]);
  const [areCoursesLoading, setAreCoursesLoading] = useState<boolean>(false);
  const [courseNotif, setCourseNotif] = useState<useNotification>();

  const loadCourses = () => {
    setAreCoursesLoading(true);
    const notif = new useNotification();
    if (courseNotif) {
      courseNotif.dismiss();
    }
    setCourseNotif(notif);
    getCourses()
      .then((courses) => {
        setCourses(courses);
        setAreCoursesLoading(false);
        notif.dismiss();
        setCourseNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingCourses' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCourses}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getCoursesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadCourses();
    return () => {
      //TODO: CLEANUP ABOVE FETCH
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Scrollbars autoHide>
      <Table sx={{ minWidth: 650 }}>
        <TableHead
          sx={{
            backgroundColor: lighten(theme.palette.primary.light, 0.6),
          }}
        >
          <TableRow>
            {[
              'number',
              'code',
              'title',
              'classrooms',
              'coursePlanStatus',
              'courseStatus',
            ].map((val, index) => (
              <TableCell key={index}>{formatMessage({ id: val })}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {areCoursesLoading ? (
            [...new Array(10)].map((_, index) => (
              <TableLaneSkeleton key={index} />
            ))
          ) : courses.length === 0 ? (
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
                {formatMessage({ id: 'noCoursesYet' })}
              </TableCell>
            </TableRow>
          ) : (
            courses.map((user, index) => (
              <CourseLane course={user} key={index} position={index + 1} />
            ))
          )}
        </TableBody>
      </Table>
    </Scrollbars>
  );
}
