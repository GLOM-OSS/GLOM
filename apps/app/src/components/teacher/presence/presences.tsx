import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { PresenceList } from '@squoolr/interfaces';
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
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD course presence  lists with data annual_credit_unit_subject_id
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newPresences: PresenceList[] = [
          {
            chapters: [],
            end_time: new Date(),
            is_published: false,
            presence_list_date: new Date(),
            presence_list_id: 'ieosl',
            start_time: new Date(),
            students: [],
            subject_code: 'EU2030',
            subject_title: "Introduction a l'Algorithmique",
          },
        ];
        setPresenceList(newPresences);
        setIsPresenceListLoading(false);
        notif.dismiss();
        setPresenceNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingPresenceLists' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadPresences(annual_credit_unit_subject_id)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getPresenceListsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [activeSession, setActiveSession] = useState<PresenceList>();

  useEffect(() => {
    loadPresences(annual_credit_unit_subject_id as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return !activeSession ? (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        justifyItems: 'end',
        rowGap: 1,
      }}
    >
      <Button variant="contained" size="small" color="primary">
        {formatMessage({ id: 'openNewList' })}
      </Button>
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
    <SessionDetails session={activeSession} />
  );
}
