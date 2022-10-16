import { ExpandMoreOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { ClassroomInterface } from '../classrooms';

const MajorDisplay = ({
  major: { major_name, classrooms },
  checked,
  indeterminate,
  onMajorClick,
  selectClassroom,
  selectedClassroomCodes,
}: {
  major: { major_name: string; classrooms: ClassroomInterface[] };
  checked: boolean;
  indeterminate: boolean;
  onMajorClick: () => void;
  selectClassroom: (cc: string) => void;
  selectedClassroomCodes: string[];
}) => {
  const [isMajorOpen, setIsMajorOpen] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  return (
    <Grid item mobile={6}>
      <Accordion
        expanded={isMajorOpen}
        onChange={() => setIsMajorOpen(!isMajorOpen)}
      >
        <AccordionSummary
          sx={{
            '& .MuiAccordionSummary-content': {
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              alignItems: 'center',
            },
          }}
          expandIcon={<ExpandMoreOutlined />}
        >
          <Checkbox indeterminate={indeterminate} checked={checked} />
          <Typography>{major_name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {classrooms.map(
            ({ classroom_level: cl, classroom_code: cc }, index) => (
              <FormGroup key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedClassroomCodes.includes(cc)}
                      onClick={() => selectClassroom(cc)}
                    />
                  }
                  label={`${formatMessage({ id: 'level' })}: ${cl}`}
                />
              </FormGroup>
            )
          )}
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default function Classrooms({
  classrooms,
  selectedClassroomCodes,
  setSelectedClassroomCodes,
  isActive,
}: {
  isActive: boolean;
  classrooms: ClassroomInterface[];
  selectedClassroomCodes: string[];
  setSelectedClassroomCodes: (selectedClassrooms: string[]) => void;
}) {
  const distinctMajors: {
    major_name: string;
    classrooms: ClassroomInterface[];
  }[] = [];

  /*TODO: this way of getting the distinct majors by classroom name will fail if we same the same major name for bachelors and masters cycle. 
  So what has to be done is add the major_id in the classroom interface so we can get distinct majors through that and sort it accordingly.

  @KD-MARK, I don't know your thoughts about this. let's discuss it the day you're integrating.
  */
  classrooms.forEach((classroom) => {
    const { classroom_name: cn } = classroom;
    if (!distinctMajors.find(({ major_name }) => major_name === cn)) {
      distinctMajors.push({
        major_name: cn,
        classrooms: classrooms.filter(
          ({ classroom_name }) => classroom_name === cn
        ),
      });
    }
  });

  const { formatMessage } = useIntl();

  //TODO:   replace major_name by major_id if above point is accepted
  let excludedClassrooms: {
    major_name: string;
    classroomLevels: number[];
  }[] = [];
  classrooms.forEach((classroom) => {
    if (!selectedClassroomCodes.includes(classroom.classroom_code)) {
      const classroomMajor = excludedClassrooms.find(
        ({ major_name: mn }) => mn === classroom.classroom_name
      );
      if (classroomMajor) {
        if (
          !classroomMajor.classroomLevels.includes(classroom.classroom_level)
        ) {
          const newExcludedClassrooms = excludedClassrooms.filter(
            ({ major_name }) => major_name !== classroom.classroom_name
          );
          excludedClassrooms = [
            ...newExcludedClassrooms,
            {
              ...classroomMajor,
              classroomLevels: [
                ...classroomMajor.classroomLevels,
                classroom.classroom_level,
              ],
            },
          ];
        }
      } else {
        excludedClassrooms.push({
          major_name: classroom.classroom_name,
          classroomLevels: [classroom.classroom_level],
        });
      }
    }
  });

  return (
    <>
      {isActive && (
        <Grid container spacing={2}>
          {distinctMajors
            .sort((a, b) => (a.major_name > b.major_name ? 1 : -1))
            .map((major, index) => {
              const checked = major.classrooms.map(({ classroom_code: cc }) =>
                selectedClassroomCodes.includes(cc)
              );

              return (
                <MajorDisplay
                  major={major}
                  key={index}
                  checked={!checked.includes(false)}
                  indeterminate={
                    checked.length > 0 &&
                    checked.includes(true) &&
                    checked.includes(false)
                  }
                  onMajorClick={() => {
                    let newSelected = selectedClassroomCodes;
                    if (checked.includes(false)) {
                      major.classrooms.forEach(({ classroom_code: cc }) => {
                        if (!newSelected.includes(cc)) newSelected.push(cc);
                      });
                      setSelectedClassroomCodes(newSelected);
                    } else {
                      major.classrooms.forEach(({ classroom_code: cc }) => {
                        newSelected = newSelected.filter((_) => _ !== cc);
                      });

                      setSelectedClassroomCodes(newSelected);
                    }
                  }}
                  selectClassroom={(cc: string) => {
                    if (selectedClassroomCodes.includes(cc)) {
                      setSelectedClassroomCodes(
                        selectedClassroomCodes.filter((_) => _ !== cc)
                      );
                    } else
                      setSelectedClassroomCodes([
                        ...selectedClassroomCodes,
                        cc,
                      ]);
                  }}
                  selectedClassroomCodes={selectedClassroomCodes}
                />
              );
            })}
        </Grid>
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
            {`${formatMessage({ id: 'academicServiceConfigs' })} : `}
          </Typography>
          <Box>
            <Typography component="span">
              {formatMessage({
                id:
                  classrooms.length === 0
                    ? 'noAvailableClassrooms'
                    : selectedClassroomCodes.length === classrooms.length
                    ? 'reuseAllClassrooms'
                    : selectedClassroomCodes.length === 0
                    ? 'noClassroom'
                    : 'excludedClasses',
              })}
            </Typography>
            {!(
              selectedClassroomCodes.length === classrooms.length ||
              selectedClassroomCodes.length === 0
            ) && (
              <>
                {' '}
                <Box component="span">
                  {excludedClassrooms.map(
                    ({ major_name, classroomLevels }, index) => (
                      <>
                        <Typography
                          component={'span'}
                          key={index}
                        >{`${major_name} - ${formatMessage({
                          id: `level${classroomLevels.length > 1 ? 's' : ''}`,
                        })}( ${classroomLevels} )`}</Typography>{' '}
                      </>
                    )
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
