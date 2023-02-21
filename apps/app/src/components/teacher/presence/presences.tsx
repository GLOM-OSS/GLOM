import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  lighten,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  getCreditUnitSubjectDetails,
  getPreseneceLists,
} from '@squoolr/api-services';
import { CreditUnitSubject, PresenceList } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { NoTableElement, TableLaneSkeleton } from '../courseLane';
import PresenceLane from './presenceLane';
import SessionDetails from './sessionDetails';

export default function Presences() {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const [isPresenceListLoading, setIsPresenceListLoading] =
    useState<boolean>(false);
  const [presenceList, setPresenceList] = useState<PresenceList[]>([]);
  const [presenceNotif, setPresenceNotif] = useState<useNotification>();

  const loadPresences = (annual_credit_unit_subject_id: string) => {
    setIsPresenceListLoading(true);
    const notif = new useNotification();
    if (presenceNotif) {
      presenceNotif.dismiss();
    }
    setPresenceNotif(notif);
    getPreseneceLists(annual_credit_unit_subject_id)
      .then((presenceLists) => {
        setPresenceList(presenceLists);
        setIsPresenceListLoading(false);
        notif.dismiss();
        setPresenceNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingPresenceLists' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadPresences(annual_credit_unit_subject_id)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getPresenceListsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [isSubjectLoading, setIsSubjectLoading] = useState<boolean>(false);
  const [subject, setSubject] = useState<CreditUnitSubject>();
  const [subjectNotif, setSubjectNotif] = useState<useNotification>();

  const loadSubjectDetail = (annual_credit_unit_subject_id: string) => {
    setIsSubjectLoading(true);
    const notif = new useNotification();
    if (subjectNotif) {
      subjectNotif.dismiss();
    }
    setSubjectNotif(notif);
    getCreditUnitSubjectDetails(annual_credit_unit_subject_id)
      .then((subject) => {
        setSubject(subject);
        setIsSubjectLoading(false);
        notif.dismiss();
        setSubjectNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingSubjectDetails' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                loadSubjectDetail(annual_credit_unit_subject_id)
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getSubjectDetailsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [activeSession, setActiveSession] = useState<PresenceList>();

  useEffect(() => {
    if (annual_credit_unit_subject_id) {
      loadPresences(annual_credit_unit_subject_id);
      loadSubjectDetail(annual_credit_unit_subject_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annual_credit_unit_subject_id]);
  return !activeSession ? (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: 1,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          columnGap: 6,
          alignItems: 'end',
        }}
      >
        <Typography variant="h6">
          {isSubjectLoading || !subject ? (
            <Skeleton animation="wave" />
          ) : (
            subject.subject_title
          )}
        </Typography>

        {subject ? (
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
              const pl: PresenceList = {
                chapters: [],
                end_time: new Date(),
                is_published: false,
                presence_list_date: new Date(),
                presence_list_id: 'new',
                start_time: new Date(),
                students: [],
                subject_code: subject.subject_code,
                subject_title: subject.subject_title,
              };
              setActiveSession(pl);
            }}
          >
            {formatMessage({ id: 'openNewList' })}
          </Button>
        ) : (
          <Button variant="contained" size="small" color="primary" disabled>
            {formatMessage({ id: 'openNewList' })}
          </Button>
        )}
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
                'subjectCode',
                'subjectTitle',
                'date',
                'startedAt',
                'endedAt',
                'workedChapters',
              ].map((val, index) => (
                <TableCell key={index}>{formatMessage({ id: val })}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isPresenceListLoading ? (
              [...new Array(10)].map((_, index) => (
                <TableLaneSkeleton cols={6} key={index} />
              ))
            ) : presenceList.length === 0 ? (
              <NoTableElement
                message={formatMessage({
                  id: 'noCourseSessionDoneYet',
                })}
                colSpan={6}
              />
            ) : (
              presenceList
                .sort((a, b) =>
                  a.presence_list_date > b.presence_list_date
                    ? 1
                    : a.start_time > b.start_time
                    ? 1
                    : -1
                )
                .map((presence, index) => (
                  <PresenceLane
                    presence={presence}
                    activateSession={() => setActiveSession(presence)}
                    key={index}
                  />
                ))
            )}
          </TableBody>
        </Table>
      </Scrollbars>
    </Box>
  ) : (
    <Box sx={{ display: 'grid', rowGap: 1, gridTemplateRows: 'auto 1fr' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: 2,
          alignItems: 'center',
        }}
      >
        <Tooltip arrow title={formatMessage({ id: 'back' })}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setActiveSession(undefined)}
            startIcon={<KeyboardBackspaceOutlined />}
          />
        </Tooltip>

        <Typography variant="h6">
          {isSubjectLoading || !subject ? (
            <Skeleton animation="wave" />
          ) : (
            subject.subject_title
          )}
        </Typography>
      </Box>
      <SessionDetails
        session={activeSession}
        reset={(session?: PresenceList) => {
          setActiveSession(
            session ?? { ...activeSession, chapters: [], students: [] }
          );
        }}
        back={() => setActiveSession(undefined)}
      />
    </Box>
  );
}
