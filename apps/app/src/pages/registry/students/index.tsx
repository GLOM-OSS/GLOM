import {
  Box,
  Button,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Classroom, Student, UEMajor } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import FilterBar from '../../../components/registry/students/filterBar';
import {
  NoTableElement,
  TableLaneSkeleton,
} from '../../../components/teacher/courseLane';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import StudentLane from 'apps/app/src/components/registry/students/studentLane';
import {
  FileDownloadOutlined,
  ReportRounded,
  WarningOutlined,
} from '@mui/icons-material';
import ConfirmImportDialog from './confirmImportDialog';

export default function Students() {
  const { formatMessage } = useIntl();

  const [isImportDialogOpen, setIsImportDialogOpen] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importNotif, setImportNotif] = useState<useNotification>();

  const [areStudentsLoading, setAreStudentsLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentNotif, setStudentNotif] = useState<useNotification>();

  const loadStudents = (major_id: string, classroom_code?: string) => {
    setAreStudentsLoading(true);
    const notif = new useNotification();
    if (studentNotif) {
      studentNotif.dismiss();
    }
    setStudentNotif(notif);
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD SCHOOL STUDENTS, WITH OPTIONAL DATA classroom_code
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newStudents: Student[] = [
          {
            annual_student_id: 'sieosl',
            birthdate: new Date(),
            classroom_acronym: 'IRT3',
            email: 'lorraintchakoumi@gmail.com',
            first_name: 'Lorrain',
            gender: 'Male',
            is_active: true,
            last_name: 'Kouatchoua Tchakoumi',
            matricule: '17C005',
            national_id_number: '000316122',
            phone_number: '681382151',
          },
        ];
        setStudents(newStudents);
        setAreStudentsLoading(false);
        notif.dismiss();
        setStudentNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingStudents' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadStudents(major_id, classroom_code)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getStudentsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [areClassroomsLoading, setAreClassroomsLoading] =
    useState<boolean>(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomNotif, setClassroomNotif] = useState<useNotification>();
  const [activeClassroomCode, setActiveClassroomCode] = useState<string>();

  const loadClassrooms = (major_id: string) => {
    setAreClassroomsLoading(true);
    const notif = new useNotification();
    if (classroomNotif) {
      classroomNotif.dismiss();
    }
    setClassroomNotif(notif);
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD major's classrooms, WITH DATA major_id
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newClassrooms: Classroom[] = [];
        setClassrooms(newClassrooms);
        setAreClassroomsLoading(false);
        notif.dismiss();
        setClassroomNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingClassrooms' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadClassrooms(major_id)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getClassroomsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [areMajorsLoading, setAreMajorsLoading] = useState<boolean>(false);
  const [majors, setMajors] = useState<UEMajor[]>([]);
  const [majorNotif, setMajorNotif] = useState<useNotification>();
  const [activeMajor, setActiveMajor] = useState<UEMajor>();

  const loadMajors = () => {
    setAreMajorsLoading(true);
    const notif = new useNotification();
    if (majorNotif) {
      majorNotif.dismiss();
    }
    setMajorNotif(notif);
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD school's majors
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newMajors: UEMajor[] = [
          {
            major_code: 'LSI',
            major_id: 'wieold',
            major_name: 'Informatique reseaux et telecoms',
            number_of_years: 4,
          },
        ];
        setMajors(newMajors);
        if (newMajors.length > 0) setActiveMajor(newMajors[0]);
        setAreMajorsLoading(false);
        notif.dismiss();
        setMajorNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingMajors' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajors}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'geMajorsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadMajors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeMajor) loadClassrooms(activeMajor.major_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMajor]);

  useEffect(() => {
    if (activeMajor) loadStudents(activeMajor.major_id, activeClassroomCode);
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
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD STUDENT IMPORT FILE TO BACKEND with data files[0] and major activeMajorId
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newStudents: Student[] = [
          {
            annual_student_id: 'sieodsl',
            birthdate: new Date(),
            classroom_acronym: 'IRT3',
            email: 'nguemeteulriche@gmail.com',
            first_name: 'Ulriche Gaella',
            gender: 'Female',
            is_active: true,
            last_name: 'Mache Nguemete',
            matricule: '18C005',
            national_id_number: '000310122',
            phone_number: '693256789',
          },
        ];
        setStudents((prevStudents) => [...prevStudents, ...newStudents]);
        notif.update({
          render: formatMessage({
            id: 'studentsImportedSuccessfully',
          }),
        });
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => uploadFile(files, activeMajorId)}
              notification={notif}
              //TODO: Message should come from backend
              message={formatMessage({ id: 'csvCreationFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
      setIsImporting(false);
    }, 3000);
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
