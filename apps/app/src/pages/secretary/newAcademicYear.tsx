import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useEffect, useState } from 'react';
import { ClassroomInterface } from '../../components/secretary/classrooms';
import RegistryConfig from '../../components/secretary/newAcademicYear/registry';
import AcademicYearData, {
  NewAcademicYearInterface,
} from '../../components/secretary/newAcademicYear/academicYearData';
import Classrooms from '../../components/secretary/newAcademicYear/classrooms';
import CoordinatorsConfig from '../../components/secretary/newAcademicYear/coordinators';
import PersonnelData, {
  NewPersonnelInterface,
} from '../../components/secretary/newAcademicYear/personnelData';
import TimelineItem from '../../components/secretary/newAcademicYear/timelineItem';
import { useIntl } from 'react-intl';
import { AcademicYearInterface } from '@squoolr/auth';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { ReportRounded } from '@mui/icons-material';
import moment from 'moment';
import { getAcademicYears, getClassrooms } from '@squoolr/api-services';

export default function NewAcademicYear() {
  const [activeItem, setActiveItem] = useState<number>(0);
  const [academicYear, setAcademicYear] = useState<NewAcademicYearInterface>({
    academic_year_end_date: new Date(),
    academic_year_start_date: new Date(),
  });
  const [personnelConfig, setPersonnelConfig] = useState<NewPersonnelInterface>(
    {
      reuse_secretariat: true,
      reuse_registry: true,
      reuse_coordinators: true,
      reuse_teachers: false,
    }
  );
  const [reuseRegistryConfig, setReuseRegistryConfig] = useState<boolean>(true);
  const [reuseCoordinatorsConfig, setReuseCoordinatorsConfig] =
    useState<boolean>(true);

  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>([]);

  const [selectedClassroomCodes, setSelectedClassroomCodes] = useState<
    string[]
  >([]);

  const { formatMessage, formatDateTimeRange } = useIntl();

  const [useTemplateYear, setUseTemplateYear] = useState<boolean>(false);
  const [templateYearId, setTemplateYearId] = useState<string>();
  const [selectedTemplateYear, setSelectedTemplateYear] =
    useState<AcademicYearInterface>();
  const [academicYears, setAcademicYears] = useState<AcademicYearInterface[]>(
    []
  );

  const [notifications, setNotifications] = useState<
    { usage: string; notif: useNotification }[]
  >([]);

  useEffect(() => {
    setSelectedClassroomCodes(classrooms.map(({ classroom_code: cc }) => cc));
  }, [classrooms]);

  useEffect(() => {
    const tempData = academicYears.sort((a, b) =>
      a.starting_date > b.starting_date ? 1 : -1
    );
    if (tempData.length > 0) {
      const temp = tempData[0];
      setAcademicYear({
        academic_year_start_date: moment(temp.ending_date)
          .add(3, 'day')
          .toDate(),
        academic_year_end_date: moment(temp.ending_date)
          .add(
            moment(temp.ending_date).diff(temp.starting_date, 'days'),
            'days'
          )
          .toDate(),
      });
    }
  }, [academicYears]);

  const loadClassrooms = () => {
    if (templateYearId !== undefined) {
      const notif = new useNotification();
      const newNotifs = notifications.filter(({ usage, notif }) => {
        if (usage === 'classrooms') notif.dismiss();
        return usage !== 'classrooms';
      });
      notif.notify({ render: formatMessage({ id: 'loadingClassrooms' }) });
      setNotifications([...newNotifs, { usage: 'classrooms', notif }]);
      getClassrooms({ academic_year_id: templateYearId })
        .then((classrooms) => {
          notif.dismiss();
          setClassrooms(classrooms);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadClassrooms}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'loadClassroomsFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    }
  };

  const loadAcademicYears = () => {
    const notif = new useNotification();
    const newNotifs = notifications.filter(({ usage, notif }) => {
      if (usage === 'academicYears') notif.dismiss();
      return usage !== 'academicYears';
    });
    notif.notify({ render: formatMessage({ id: 'loadingAcademicYears' }) });
    setNotifications([...newNotifs, { usage: 'academicYears', notif }]);
    getAcademicYears()
      .then((academicYears) => {
        notif.dismiss();
        setAcademicYears(academicYears);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadAcademicYears}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'loadAcademicYearsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (useTemplateYear && academicYears.length === 0) {
      loadAcademicYears();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useTemplateYear]);

  useEffect(() => {
    loadClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateYearId]);

  const [isCreatingAcademicYear, setIsCreatingAcademicYear] =
    useState<boolean>(false);
  const createAcademicYear = () => {
    setIsCreatingAcademicYear(true);
    const notif = new useNotification();
    const newNotifs = notifications.filter(({ usage, notif }) => {
      if (usage === 'createAcademicYear') notif.dismiss();
      return usage !== 'createAcademicYear';
    });
    notif.notify({ render: formatMessage({ id: 'creatingAcademicYears' }) });
    setNotifications([...newNotifs, { usage: 'createAcademicYear', notif }]);
    setTimeout(() => {
      setIsCreatingAcademicYear(false);
      switch (useTemplateYear) {
        case false: {
          //TODO: CREATE ACADEMIC YEAR HERE WITH DATA: academicYear.
          //TODO: DON'T FORGET TO VERIFY THAT THERE IS NO CHAUVAUCHEMENT BETWEEN THE NEW DATA AND ANY EXISTING ACADEMIC YEAR
          if (random() > 5) {
            notif.update({
              render: formatMessage({ id: 'academicYearCreatedSuccessfully' }),
            });
            //TODO: CHANGE ACTIVE ACADEMIC YEAR IN CONTEXT TO THE NEWLY CREATED ONE
            //TODO: navigate('/configurations/departments')
          } else {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={createAcademicYear}
                  notification={notif}
                  message={formatMessage({ id: 'createAcademicYearFailed' })}
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          }
          break;
        }
        case true: {
          // TODO: CREATE ACADEMIC YEAR HERE WITH DATA: templateYearId, academicYear, selectedClassroomCodes, personnelConfig, reuseCoordinatorsConfig, reuseRegistryConfig
          //TODO: DON'T FORGET TO VERIFY THAT THERE IS NO CHAUVAUCHEMENT BETWEEN THE NEW DATA AND ANY EXISTING ACADEMIC YEAR
          if (random() > 5) {
            notif.update({
              render: formatMessage({ id: 'createAcademicYearSuccessfully' }),
            });
            //TODO: CHANGE ACTIVE ACADEMIC YEAR IN CONTEXT TO THE NEWLY CREATED ONE
            //TODO: navigate('/configurations/departments')
          } else {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={createAcademicYear}
                  notification={notif}
                  message={formatMessage({ id: 'createAcademicYearFailed' })}
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          }
          break;
        }
      }
    }, 3000);
  };

  return (
    <>
      <FormControl
        sx={{ marginBottom: theme.spacing(3), marginLeft: theme.spacing(1) }}
      >
        <FormLabel
          sx={{
            ...theme.typography.h5,
            fontWeight: 500,
            color: theme.common.body,
          }}
        >
          {formatMessage({ id: 'createAcademicYear' })}
        </FormLabel>
        <RadioGroup
          row
          value={useTemplateYear}
          onChange={(event) =>
            setUseTemplateYear(event.target.value === 'true')
          }
        >
          <FormControlLabel
            value={false}
            control={<Radio />}
            label={formatMessage({ id: 'fromScratch' })}
          />
          <FormControlLabel
            value={true}
            control={<Radio />}
            label={formatMessage({ id: 'fromTemplateYear' })}
          />
        </RadioGroup>
      </FormControl>
      <Collapse in={!useTemplateYear}>
        <TimelineItem
          isActive
          isLastItem
          number={1}
          subtitleId={'academicYearBaseInformation'}
          titleId={'academicYearInformation'}
          onClick={() => setActiveItem(1)}
        >
          <AcademicYearData
            initialAcademicYear={academicYear}
            isActive
            hasSubmit
            submitDisabled={isCreatingAcademicYear}
            handleChange={setAcademicYear}
            handleSubmit={(academicYear: NewAcademicYearInterface) => {
              setAcademicYear(academicYear);
              createAcademicYear();
            }}
          />
        </TimelineItem>
      </Collapse>
      <Collapse in={useTemplateYear}>
        <Box sx={{ display: 'grid', gap: theme.spacing(2.5) }}>
          {[
            {
              subtitleId: 'selectTemplateYear',
              titleId: 'templateYear',
              element: (isActive: boolean) => (
                <>
                  {isActive && (
                    <TextField
                      autoFocus
                      select
                      value={templateYearId}
                      sx={{ minWidth: '400px' }}
                      onChange={(event) => {
                        setSelectedTemplateYear(
                          academicYears.find(
                            ({ academic_year_id: id }) =>
                              id === event.target.value
                          )
                        );
                        setTemplateYearId(event.target.value);
                      }}
                      placeholder={formatMessage({ id: 'templateYear' })}
                      label={formatMessage({ id: 'selectTemplateYear' })}
                      required
                      color="primary"
                    >
                      {academicYears.map(
                        (
                          {
                            academic_year_id,
                            code,
                            ending_date,
                            starting_date,
                          },
                          index
                        ) => (
                          <MenuItem
                            key={index}
                            value={academic_year_id}
                          >{`${formatDateTimeRange(starting_date, ending_date, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })} ( ${code} )`}</MenuItem>
                        )
                      )}
                    </TextField>
                  )}
                  {!isActive && (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: theme.spacing(1),
                      }}
                    >
                      <Typography sx={{ color: theme.common.placeholder }}>
                        {`${formatMessage({ id: 'templateYear' })} : `}
                      </Typography>
                      <Typography>
                        {selectedTemplateYear !== undefined
                          ? `${formatDateTimeRange(
                              selectedTemplateYear.starting_date,
                              selectedTemplateYear.ending_date,
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )} ( ${selectedTemplateYear.code} )`
                          : formatMessage({ id: 'n/a' })}
                      </Typography>
                    </Box>
                  )}
                </>
              ),
            },
            {
              subtitleId: 'academicYearBaseInformation',
              titleId: 'academicYearInformation',
              element: (isActive: boolean) => (
                <AcademicYearData
                  submitDisabled={false}
                  initialAcademicYear={academicYear}
                  isActive={isActive}
                  handleChange={setAcademicYear}
                  handleSubmit={(academicYear: NewAcademicYearInterface) => {
                    setActiveItem(2);
                    setAcademicYear(academicYear);
                  }}
                />
              ),
            },
            {
              subtitleId: 'personnelInformation',
              titleId: 'personnel',
              element: (isActive: boolean) => (
                <PersonnelData
                  isActive={isActive}
                  personnelConfig={personnelConfig}
                  setPersonnelConfig={setPersonnelConfig}
                />
              ),
            },
            {
              subtitleId: 'selectClassroomsToReuse',
              titleId: 'classrooms',
              element: (isActive: boolean) => (
                <Classrooms
                  isActive={isActive}
                  classrooms={classrooms}
                  selectedClassroomCodes={selectedClassroomCodes}
                  setSelectedClassroomCodes={setSelectedClassroomCodes}
                />
              ),
            },
            {
              subtitleId: 'areYouWillingToReuseData',
              titleId: 'registrySettings',
              element: (isActive: boolean) => (
                <RegistryConfig
                  isActive={isActive}
                  reuseRegistryConfig={reuseRegistryConfig}
                  setReuseRegistryConfig={setReuseRegistryConfig}
                />
              ),
            },
            {
              subtitleId: 'areYouWillingToReuseData',
              titleId: 'coordinatorsConfiguration',
              element: (isActive: boolean) => (
                <CoordinatorsConfig
                  isActive={isActive}
                  reuseCoordinatorsConfig={reuseCoordinatorsConfig}
                  setReuseCoordinatorsConfig={setReuseCoordinatorsConfig}
                />
              ),
            },
          ].map(({ element, subtitleId, titleId }, index) =>
            templateYearId === undefined ? (
              index !== 0 ? null : (
                <TimelineItem
                  key={index}
                  isActive={index === activeItem}
                  isLastItem={index === 0}
                  number={index + 1}
                  subtitleId={subtitleId}
                  titleId={titleId}
                  onClick={() =>
                    templateYearId !== undefined
                      ? setActiveItem(index)
                      : alert(formatMessage({ id: 'selectAcademicYearFirst' }))
                  }
                >
                  {element(index === activeItem)}
                </TimelineItem>
              )
            ) : (
              <TimelineItem
                key={index}
                isActive={index === activeItem}
                isLastItem={index === 6}
                number={index + 1}
                subtitleId={subtitleId}
                titleId={titleId}
                onClick={() =>
                  templateYearId !== undefined
                    ? setActiveItem(index)
                    : alert(formatMessage({ id: 'selectAcademicYearFirst' }))
                }
              >
                {element(index === activeItem)}
              </TimelineItem>
            )
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ justifySelf: 'start' }}
            onClick={() => {
              if (templateYearId !== undefined) createAcademicYear();
            }}
            disabled={templateYearId === undefined || isCreatingAcademicYear}
          >
            {formatMessage({ id: 'createAcademicYear' })}
          </Button>
        </Box>
      </Collapse>
    </>
  );
}
