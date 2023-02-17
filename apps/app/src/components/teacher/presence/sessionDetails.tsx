import { ExpandMoreOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { PresenceList } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { NoTableElement } from '../courseLane';
import PresenceStudentLane from './presenceStudentLane';

export default function SessionDetails({
  session: {
    presence_list_date: pld,
    start_time: s_time,
    end_time: e_time,
    is_published: ip,
    chapters: c,
    students: s,
  },
}: {
  session: PresenceList;
}) {
  const { formatMessage, formatDate, formatTime } = useIntl();

  return (
    <Box
      sx={{
        display: 'grid',
        rowGap: 2,
        gridTemplateRows: ip ? 'auto 1fr' : 'auto auto 1fr',
      }}
    >
      <Accordion
        elevation={0}
        sx={{ backgroundColor: lighten(theme.palette.primary.main, 0.9) }}
      >
        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
          <Typography fontWeight={500} textTransform="uppercase">
            {formatMessage({ id: 'chapterCoverage' })}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', rowGap: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                columnGap: 2,
                alignItems: 'end',
              }}
            >
              <Typography>
                {formatMessage({ id: 'sessionDate' })}
                {' : '}
                <Typography component="span" fontWeight={500}>
                  {formatDate(pld, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })}
                </Typography>
              </Typography>
              {ip ? (
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    gridTemplateColumns: 'auto 1fr',
                  }}
                >
                  <Typography>
                    {`${formatMessage({ id: 'startedAt' })} : `}
                    <Typography component="span" fontWeight={500}>
                      {formatTime(s_time, {
                        hour: '2-digit',
                        minute: '2-digit',
                        dayPeriod: 'short',
                      })}
                    </Typography>
                  </Typography>
                  <Typography>
                    {`${formatMessage({ id: 'endedAt' })} : `}
                    <Typography component="span" fontWeight={500}>
                      {formatTime(e_time, {
                        hour: '2-digit',
                        minute: '2-digit',
                        dayPeriod: 'short',
                      })}
                    </Typography>
                  </Typography>
                </Box>
              ) : (
                'input fields'
              )}
            </Box>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <Typography fontWeight={500}>
                {`${formatMessage({ id: 'dispensedChapters' })} `}
                {ip && (
                  <Typography
                    component="span"
                    fontWeight={500}
                  >{`(${c.length})`}</Typography>
                )}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  columnGap: 1,
                  alignItems: 'end',
                }}
              >
                {ip ? (
                  c.length === 0 ? (
                    <Typography>
                      {formatMessage({ id: 'noChaptersDone' })}
                    </Typography>
                  ) : (
                    c.map(({ chapter_title: ct }, index) => {
                      return (
                        <Typography key={index}>
                          {`${index + 1}. ${ct}`}
                        </Typography>
                      );
                    })
                  )
                ) : (
                  'make it rain'
                )}
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      {!ip && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ justifySelf: 'end', textTransform: 'none' }}
        >
          {formatMessage({ id: 'publishList' })}
        </Button>
      )}
      <Scrollbars autoHide>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              backgroundColor: lighten(theme.palette.primary.light, 0.6),
            }}
          >
            <TableRow>
              {['matricule', 'studentName', 'present'].map((val, index) =>
                ip ? (
                  index < 2 ? (
                    <TableCell
                      key={index}
                      align={index === 2 ? 'right' : 'left'}
                    >
                      {formatMessage({ id: val })}
                    </TableCell>
                  ) : null
                ) : (
                  <TableCell key={index} align={index === 2 ? 'right' : 'left'}>
                    {formatMessage({ id: val })}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {s.length === 0 ? (
              <NoTableElement
                message={formatMessage({
                  id: 'noStudentsInClass',
                })}
                colSpan={ip ? 2 : 3}
              />
            ) : (
              s
                .sort((a, b) =>
                  a.first_name > b.first_name
                    ? 1
                    : a.last_name > b.last_name
                    ? 1
                    : a.matricule > b.matricule
                    ? 1
                    : -1
                )
                .map((student, index) => (
                  <PresenceStudentLane student={student} key={index} />
                ))
            )}
          </TableBody>
        </Table>
      </Scrollbars>
    </Box>
  );
}
