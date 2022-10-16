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
      setTimeout(() => {
        //TODO: LOAD CLASSROOMS FOR ACADEMIC YEAR HERE WITH DATA: templateYearId
        if (random() > 5) {
          const newClassrooms: ClassroomInterface[] = [
            {
              classroom_code: 'cmr21-993',
              classroom_level: 1,
              classroom_name: 'Energies Renouvelables et genie climatique',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr20-993',
              classroom_level: 2,
              classroom_name: 'Energies Renouvelables et genie climatique',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr19-993',
              classroom_level: 3,
              classroom_name: 'Energies Renouvelables et genie climatique',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr16-993',
              classroom_level: 1,
              classroom_name: 'Informatique reseau et telecommunications',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr17-993',
              classroom_level: 2,
              classroom_name: 'Informatique reseau et telecommunications',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr18-993',
              classroom_level: 3,
              classroom_name: 'Informatique reseau et telecommunications',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr13-993',
              classroom_level: 1,
              classroom_name:
                'Mathematiquest et informatique appliques a la finance',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr14-993',
              classroom_level: 2,
              classroom_name:
                'Mathematiquest et informatique appliques a la finance',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr15-993',
              classroom_level: 3,
              classroom_name:
                'Mathematiquest et informatique appliques a la finance',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr10-993',
              classroom_level: 1,
              classroom_name: 'Genie Civil',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr11-993',
              classroom_level: 2,
              classroom_name: 'Genie Civil',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr12-993',
              classroom_level: 3,
              classroom_name: 'Genie Civil',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr9-993',
              classroom_level: 1,
              classroom_name: 'Genie mecaniques',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr8-993',
              classroom_level: 3,
              classroom_name: 'Genie mecaniques',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr7-993',
              classroom_level: 2,
              classroom_name: 'Genie mecaniques',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr5-993',
              classroom_level: 1,
              classroom_name: 'Architecture et urbanisme',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr4-993',
              classroom_level: 2,
              classroom_name: 'Architecture et urbanisme',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr6-993',
              classroom_level: 3,
              classroom_name: 'Architecture et urbanisme',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr-993',
              classroom_level: 1,
              classroom_name: 'Ingenieurie Biomedical',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr2-993',
              classroom_level: 2,
              classroom_name: 'Ingenieurie Biomedical',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
            {
              classroom_code: 'cmr3-993',
              classroom_level: 3,
              classroom_name: 'Ingenieurie Biomedical',
              registration_fee: 10000,
              total_fee_due: 18000000,
            },
          ];
          notif.dismiss();
          setClassrooms(newClassrooms);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadClassrooms}
                notification={notif}
                message={formatMessage({ id: 'loadClassroomsFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
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
    setTimeout(() => {
      //TODO: LOAD ACADEMIC YEARS FOR SCHOOL HERE
      if (random() > 5) {
        const newAcademicYears: AcademicYearInterface[] = [
          {
            academic_year_id: 'hske',
            code: 'Year2015201700001',
            ending_date: new Date(),
            starting_date: new Date('12/12/2021'),
            year_status: 'active',
          },
        ];
        notif.dismiss();
        setAcademicYears(newAcademicYears);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadAcademicYears}
              notification={notif}
              message={formatMessage({ id: 'loadAcademicYearsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
            onClick={()=>{
              if(templateYearId!== undefined)createAcademicYear()
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
