import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  lighten,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { getCourses } from '@squoolr/api-services';
import { Course } from '@squoolr/interfaces';
import { useUser } from '@squoolr/squoolr-layout';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import CourseLane from '../../components/course/courseLane';
import {
  NoTableElement,
  TableLaneSkeleton,
} from '../../components/helpers/tables';

export default function Courses() {
  const { annualStudent } = useUser();
  const { formatMessage } = useIntl();

  const [areCoursesLoading, setAreCoursesLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseNotif, setCourseNotif] = useState<useNotification>();

  const loadCourses = (activeSemester?: number) => {
    setAreCoursesLoading(true);
    const notif = new useNotification();
    if (courseNotif) {
      courseNotif.dismiss();
    }
    setCourseNotif(notif);
    getCourses(activeSemester === 0 ? undefined : activeSemester)
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
              retryFunction={() => loadCourses(activeSemester)}
              notification={notif}
              message={
                error?.nessage || formatMessage({ id: 'getCoursesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [activeSemester, setActiveSemester] = useState<number>(0);

  useEffect(() => {
    loadCourses(activeSemester);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSemester]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: 2,
      }}
    >
      <FormControl sx={{ marginTop: 1, justifySelf: 'start' }}>
        <InputLabel id="semester">
          {formatMessage({ id: 'semester' })}
        </InputLabel>
        <Select
          labelId="semester"
          disabled={!annualStudent || areCoursesLoading}
          value={activeSemester}
          size="small"
          onChange={(event) => setActiveSemester(Number(event.target.value))}
          sx={{ minWidth: '100px' }}
          input={<OutlinedInput label={formatMessage({ id: 'semester' })} />}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
              },
            },
          }}
        >
          <MenuItem value={0}>{formatMessage({ id: 'all' })}</MenuItem>
          {[
            ...new Array(annualStudent ? annualStudent.classroom_level * 2 : 0),
          ].map((_, index) => (
            <MenuItem key={index} value={index + 1}>
              {index + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Scrollbars autoHide>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              backgroundColor: lighten(theme.palette.primary.light, 0.6),
            }}
          >
            <TableRow>
              {['subjectCode', 'subjectTitle', 'semester'].map((val, index) => (
                <TableCell key={index} align={index === 2 ? 'right' : 'left'}>
                  {formatMessage({ id: val })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {areCoursesLoading ? (
              [...new Array(5)].map((_, index) => (
                <TableLaneSkeleton cols={3} key={index} />
              ))
            ) : courses.length === 0 ? (
              <NoTableElement
                message={formatMessage({
                  id: 'noRegisteredCourse',
                })}
                colSpan={3}
              />
            ) : (
              courses
                .sort((a, b) =>
                  (a.semester as number) > (b.semester as number)
                    ? 1
                    : a.subject_title > b.subject_title
                    ? 1
                    : a.subject_code > b.subject_code
                    ? 1
                    : -1
                )
                .map((course, index) => (
                  <CourseLane course={course} key={index} />
                ))
            )}
          </TableBody>
        </Table>
      </Scrollbars>
    </Box>
  );
}
