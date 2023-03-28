import {
  FileDownloadOutlined,
  ReportRounded,
  WarningOutlined
} from '@mui/icons-material';
import {
  Box,
  Button,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import {
  getClassrooms,
  getMajors,
  getStudents,
  importNewStudents
} from '@squoolr/api-services';
import { Classroom, Major, Student } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import FilterBar from '../../../components/registry/students/filterBar';
import StudentLane from '../../../components/registry/students/studentLane';
import {
  NoTableElement,
  TableLaneSkeleton
} from '../../../components/teacher/courseLane';
import ConfirmImportDialog from './confirmImportDialog';

export default function Students() {
  const { formatMessage } = useIntl();

  const [isImportDialogOpen, setIsImportDialogOpen] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importNotif, setImportNotif] = useState<useNotification>();

  const [areStudentsLoading, setAreStudentsLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentNotif, setStudentNotif] = useState<useNotification>();

  const loadStudents = (major_code: string, classroom_code?: string) => {
    setAreStudentsLoading(true);
    const notif = new useNotification();
    if (studentNotif) {
      studentNotif.dismiss();
    }
    setStudentNotif(notif);
    getStudents(major_code, classroom_code)
      .then((students) => {
        console.log(students)
        setStudents(students);
        setAreStudentsLoading(false);
        notif.dismiss();
        setStudentNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingStudents' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadStudents(major_code, classroom_code)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getStudentsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [areClassroomsLoading, setAreClassroomsLoading] =
    useState<boolean>(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomNotif, setClassroomNotif] = useState<useNotification>();
  const [activeClassroomCode, setActiveClassroomCode] = useState<string>();

  const loadClassrooms = (major_code: string) => {
    setAreClassroomsLoading(true);
    const notif = new useNotification();
    if (classroomNotif) {
      classroomNotif.dismiss();
    }
    setClassroomNotif(notif);
    getClassrooms({ major_code })
      .then((classrooms) => {
        setClassrooms(classrooms);
        setAreClassroomsLoading(false);
        notif.dismiss();
        setClassroomNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingClassrooms' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadClassrooms(major_code)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getClassroomsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [areMajorsLoading, setAreMajorsLoading] = useState<boolean>(false);
  const [majors, setMajors] = useState<Major[]>([]);
  const [majorNotif, setMajorNotif] = useState<useNotification>();
  const [activeMajor, setActiveMajor] = useState<Major>();

  const loadMajors = () => {
    setAreMajorsLoading(true);
    const notif = new useNotification();
    if (majorNotif) {
      majorNotif.dismiss();
    }
    setMajorNotif(notif);
    getMajors()
      .then((majors) => {
        setMajors(majors);
        if (majors.length > 0) setActiveMajor(majors[0]);
        setAreMajorsLoading(false);
        notif.dismiss();
        setMajorNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingMajors' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajors}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'geMajorsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadMajors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeMajor) loadClassrooms(activeMajor.major_code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMajor]);

  useEffect(() => {
    if (activeMajor) loadStudents(activeMajor.major_code, activeClassroomCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMajor, activeClassroomCode]);

  function uploadFile(files: FileList, activeMajorId: string) {
    setIsImportDialogOpen(false);
    setIsImporting(true);
    if (importNotif) importNotif.dismiss();
    const notif = new useNotification();
    setImportNotif(notif);
    notif.notify({
      render: formatMessage({ id: 'importingStudents' }),
    });
    importNewStudents(activeMajorId, files[0])
      .then(() => {
        loadStudents(activeMajorId);
        notif.update({
          render: formatMessage({
            id: 'studentsImportedSuccessfully',
          }),
        });
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => uploadFile(files, activeMajorId)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'csvCreationFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsImporting(false));
  }

  return (
    <>
      <ConfirmImportDialog
        closeDialog={() => setIsImportDialogOpen(false)}
        confirm={(files: FileList) => {
          if (activeMajor) {
            uploadFile(files, activeMajor.major_id);
          } else {
            const notif = new useNotification();
            notif.notify({ render: formatMessage({ id: 'displayingError' }) });
            notif.update({
              render: formatMessage({ id: 'selectMajorFirst' }),
              icon: <WarningOutlined fontSize="small" color="warning" />,
            });
          }
        }}
        dialogMessage={
          <Typography>
            <Typography variant="body2" component="span">
              {formatMessage({ id: 'importIntoLevel1Message1' })}
            </Typography>
            <Typography
              variant="body2"
              component="span"
              fontWeight={'bold'}
              padding="0 4px"
            >
              {activeMajor?.major_name}
            </Typography>
            <Typography variant="body2" component="span">
              {formatMessage({ id: 'importIntoLevel1Message2' })}
            </Typography>
          </Typography>
        }
        isDialogOpen={isImportDialogOpen}
        dialogTitle={formatMessage({ id: 'confirmImportIntoLevel1' })}
      />
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: 2.5,
        }}
      >
        <Box
          sx={{
            marginTop: theme.spacing(1),
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: theme.spacing(2),
            alignItems: 'center',
            justifyItems: 'start',
          }}
        >
          <FilterBar
            handleImport={() => setIsImportDialogOpen(true)}
            classrooms={classrooms}
            disabled={areClassroomsLoading || areMajorsLoading || isImporting}
            majors={majors}
            setActiveClassroom={setActiveClassroomCode}
            setActiveMajor={setActiveMajor}
            activeClassroom={activeClassroomCode}
            activeMajor={activeMajor}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
            onClick={() => setIsImportDialogOpen(true)}
            disabled={
              isImporting ||
              isImportDialogOpen ||
              areMajorsLoading ||
              // !activeMajorId ||
              areClassroomsLoading
            }
            endIcon={<FileDownloadOutlined />}
          >
            {formatMessage({ id: 'importStudents' })}
          </Button>
        </Box>

        <Scrollbars autoHide>
          <Table sx={{ minWidth: 650 }}>
            <TableHead
              sx={{
                backgroundColor: lighten(theme.palette.primary.light, 0.6),
              }}
            >
              <TableRow>
                {[
                  'matricule',
                  'firstName',
                  'lastName',
                  'phone',
                  'email',
                  'classe',
                  'status',
                ].map((val, index) => (
                  <TableCell key={index}>
                    {formatMessage({ id: val })}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {areStudentsLoading || areMajorsLoading ? (
                [...new Array(10)].map((_, index) => (
                  <TableLaneSkeleton cols={7} key={index} />
                ))
              ) : students.length === 0 ? (
                <NoTableElement
                  message={formatMessage({
                    id:
                      majors.length === 0
                        ? 'noMajorsInSchool'
                        : 'noStudentsInSchoolYet',
                  })}
                  colSpan={7}
                />
              ) : (
                students
                  .sort((a, b) =>
                    a.classroom_acronym > b.classroom_acronym
                      ? 1
                      : a.is_active > b.is_active
                      ? 1
                      : a.matricule > b.matricule
                      ? 1
                      : a.first_name > b.first_name
                      ? 1
                      : a.last_name > b.last_name
                      ? 1
                      : a.phone_number > b.phone_number
                      ? 1
                      : a.email > b.email
                      ? 1
                      : -1
                  )
                  .map((student, index) => (
                    <StudentLane student={student} key={index} />
                  ))
              )}
            </TableBody>
          </Table>
        </Scrollbars>
      </Box>
    </>
  );
}
