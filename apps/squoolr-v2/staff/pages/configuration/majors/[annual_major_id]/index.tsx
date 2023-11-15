import {
  ConfirmDialog,
  NoTableElement,
  TableHeaderItem,
  TableSkeleton,
} from '@glom/components';
import { ClassroomEntity, MajorEntity } from '@glom/data-types/squoolr';
import {
  useBreadcrumb,
  useDispatchBreadcrumb,
} from '@glom/squoolr-v2/side-nav';
import { useTheme } from '@glom/theme';
import reset from '@iconify/icons-fluent/arrow-counterclockwise-48-regular';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import filter from '@iconify/icons-fluent/filter-28-regular';
import more from '@iconify/icons-fluent/more-vertical-48-regular';
import search from '@iconify/icons-fluent/search-48-regular';
import questionMark from '@iconify/icons-fluent/book-question-mark-24-regular';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import FilterMenu from '../../../../components/configuration/departments/FilterMenu';
import ManageClassroomMenu from '../../../../components/configuration/majors/classrooms/ManageClassroomMenu';

export default function Index() {
  const breadcrumbDispatch = useDispatchBreadcrumb();
  const breadcrumbs = useBreadcrumb();
  const theme = useTheme();
  const { formatMessage, formatNumber } = useIntl();
  const {
    query: { annual_major_id },
    asPath,
  } = useRouter();

  const [majorData, setMajorData] = useState<MajorEntity>();
  useEffect(() => {
    if (!!annual_major_id) {
      //TODO: CALL API HERE TO FETCH ACTIVE MAJOR DATA
      setTimeout(() => {
        setMajorData({
          annual_major_id: 'boston123',
          cycle: {
            cycle_id: 'Licence',
            cycle_name: 'BACHELOR',
            created_at: new Date().toISOString(),
            number_of_years: 3,
          },
          department_acronym: 'DST',
          department_id: 'boston1234',
          major_acronym: 'IRT',
          major_id: 'boston1234',
          major_name: 'Informatique, Reseaux et Telecommunications',
          created_at: new Date().toISOString(),
          is_deleted: false,
        });
      }, 3000);

      const doesBreadcrumbHaveItem = breadcrumbs.find(
        ({ route }) => route && route.includes(annual_major_id as string)
      );

      if (!!majorData) {
        if (!doesBreadcrumbHaveItem)
          breadcrumbDispatch({
            action: 'ADD',
            payload: [{ title: majorData.major_acronym, route: asPath }],
          });
        else if (doesBreadcrumbHaveItem.title !== majorData.major_acronym) {
          const tt = breadcrumbs.filter(
            ({ route }) =>
              (route && !route.includes(annual_major_id as string)) || !route
          );
          breadcrumbDispatch({
            action: 'RESET',
            payload: [...tt, { title: majorData.major_acronym, route: asPath }],
          });
        }
      } else {
        if (!doesBreadcrumbHaveItem)
          breadcrumbDispatch({
            action: 'ADD',
            payload: [
              { title: formatMessage({ id: 'loading' }), route: asPath },
            ],
          });
      }
    }
  }, [annual_major_id, majorData]);

  const tableHeaders = ['', 'code#', 'className', 'numberOfDivisions', ''];

  //TODO: REPLACE WITH with reactQuery own
  const [isClassroomDataFetching, setIsMajorDataFetching] =
    useState<boolean>(true);

  //TODO: FETCH LIST OF majors HERE
  const [classroomData, setClassroomData] = useState<ClassroomEntity[]>();

  //TODO: REMOVE THIS WHEN INTEGRATION IS DONE
  useEffect(() => {
    setTimeout(() => {
      setClassroomData([
        {
          annual_classroom_id: 'boston123',
          annual_coordinator_id: '',
          annual_major_id: 'bostoin123',
          classroom_acronym: 'RT3',
          classroom_code: 'Bostone234',
          classroom_id: 'wieos',
          classroom_level: 3,
          classroom_name: 'Reseaux Telecommunications',
          created_at: new Date().toISOString(),
          is_deleted: false,
          number_of_divisions: 3,
          registration_fee: null,
          total_fee_due: null,
        },
      ]);
      setIsMajorDataFetching(false);
    }, 3000);
  }, []);

  const [canSearchExpand, setCanSearchExpand] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showArchives, setShowArchives] = useState<boolean>(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    //TODO: CALL fetch list of major API HERE with searchValue and showArchives use it to filter. MUTATE majors DATA WHEN IT'S DONE
    alert('hello world');
  }, [searchValue, showArchives]);

  const [selectedClassroomsIds, setSelectedClassroomIds] = useState<string[]>(
    []
  );

  function selectAllClassrooms() {
    setSelectedClassroomIds(
      selectedClassroomsIds.length === classroomData.length
        ? []
        : classroomData.map(({ annual_classroom_id }) => annual_classroom_id)
    );
  }

  function selectMajor(annual_classroom_id: string) {
    setSelectedClassroomIds(
      selectedClassroomsIds.includes(annual_classroom_id)
        ? selectedClassroomsIds.filter(
            (selectedClassroomId) => selectedClassroomId !== annual_classroom_id
          )
        : [...selectedClassroomsIds, annual_classroom_id]
    );
  }

  const [activeClassroomId, setActiveClassroomId] = useState<string>();
  const [isActiveClassroomArchived, setIsActiveClassroomArchived] =
    useState<boolean>(false);

  const [isConfirmArchiveDialogOpen, setIsConfirmArchiveDialogOpen] =
    useState<boolean>(false);
  const [isConfirmUnarchiveDialogOpen, setIsConfirmUnarchiveDialogOpen] =
    useState<boolean>(false);

  //TODO: REMOVE THIS AND USE reactQuery own
  const [isArchiving, setIsArchiving] = useState<boolean>(false);
  //TODO: REMOVE THIS AND USE reactQuery own
  const [isUnarchiving, setIsUnarchiving] = useState<boolean>(false);
  function confirmArchiveUnarchive() {
    if (isConfirmArchiveDialogOpen) {
      setIsArchiving(true);
      //TODO: CALL API HERE TO ARCHIVE classroom with data selectedClassroomIds if length>1 or otherwise [activeClassroomId]
      setTimeout(() => {
        alert('done archiving');
        //TODO: MUTATE classroomData here so the data updates
        setIsArchiving(false);
        setIsConfirmArchiveDialogOpen(false);
        setActiveClassroomId(undefined);
      }, 3000);
    }
    if (isConfirmUnarchiveDialogOpen) {
      setIsUnarchiving(true);
      //TODO: CALL API HERE TO ARCHIVE classroom with data selectedClassroomIds if length>1 or otherwise [activeClassroomId]
      setTimeout(() => {
        alert('done unarchiving');
        //TODO: MUTATE classroomData here so the data updates
        setIsUnarchiving(false);
        setIsConfirmUnarchiveDialogOpen(false);
        setActiveClassroomId(undefined);
      }, 3000);
    }
  }

  return (
    <>
      <FilterMenu
        closeMenu={() => {
          setFilterAnchorEl(null);
        }}
        isOpen={!!filterAnchorEl}
        onShowArchives={() => setShowArchives((prev) => !prev)}
        anchorEl={filterAnchorEl}
        showArchives={showArchives}
      />

      <ManageClassroomMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        isOpen={!!anchorEl}
        isArchived={isActiveClassroomArchived}
        confirmArchive={() => setIsConfirmArchiveDialogOpen(true)}
        confirmUnarchive={() => setIsConfirmUnarchiveDialogOpen(true)}
      />
      <ConfirmDialog
        closeDialog={() => {
          setIsConfirmArchiveDialogOpen(false);
          setIsConfirmUnarchiveDialogOpen(false);
        }}
        dialogMessage={formatMessage({
          id: isConfirmArchiveDialogOpen
            ? selectedClassroomsIds.length > 1
              ? 'confirmArchiveClassroomsDialogMessage'
              : 'confirmArchiveClassroomDialogMessage'
            : selectedClassroomsIds.length > 1
            ? 'confirmUnarchiveClassroomsDialogMessage'
            : 'confirmUnarchiveClassroomDialogMessage',
        })}
        isDialogOpen={
          isConfirmArchiveDialogOpen || isConfirmUnarchiveDialogOpen
        }
        confirm={confirmArchiveUnarchive}
        dialogTitle={formatMessage({
          id: isConfirmArchiveDialogOpen
            ? selectedClassroomsIds.length > 1
              ? 'archiveClassrooms'
              : 'archiveClassroom'
            : selectedClassroomsIds.length > 1
            ? 'unarchiveClassrooms'
            : 'unarchiveClassroom',
        })}
        confirmButton={formatMessage({
          id: isConfirmArchiveDialogOpen ? 'archive' : 'unarchive',
        })}
        danger
        closeOnConfirm
        isSubmitting={isArchiving || isUnarchiving}
      />
      <Box
        sx={{
          marginBottom: '20px',
          display: majorData ? 'block' : 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: 0.5,
          alignItems: 'baseline',
          color: theme.common.titleActive,
        }}
      >
        <Typography variant="h3" component="span">
          {formatMessage({ id: 'classesOf' })}
        </Typography>
        {majorData ? (
          <Typography
            variant="h3"
            component="span"
          >{` ${majorData.major_name} (${majorData.major_acronym})`}</Typography>
        ) : (
          <Skeleton
            sx={{ alignSelf: 'stretch' }}
            animation="wave"
            width="30%"
          />
        )}
      </Box>
      <Box
        sx={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          border: `1px solid ${theme.common.line}`,
          borderBottom: 'none',
          padding: '8px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
          justifyItems: 'end',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            columnGap: 2,
            alignItems: 'center',
            justifyContent: 'start',
          }}
        >
          <TextField
            onClick={() => setCanSearchExpand(true)}
            onBlur={() =>
              !searchValue
                ? setCanSearchExpand(false)
                : setCanSearchExpand(true)
            }
            onChange={(e) => setSearchValue(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              transition: 'width 0.3s',
              '& .MuiInputBase-root': {
                paddingLeft: '8px',
              },
              '& .MuiInputBase-input': {
                padding: '8.5px 0',
                transition: 'width 0.3s',
                width: canSearchExpand ? '100%' : 0,
              },
              '&:hover': {
                width: '100%',
                '& .MuiInputBase-input': {
                  width: '100%',
                },
              },
            }}
            placeholder={formatMessage({ id: 'search' })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ width: 'auto' }}>
                  <Icon icon={search} fontSize={20} />
                </InputAdornment>
              ),
            }}
          />

          <TableHeaderItem
            icon={reset}
            title={formatMessage({ id: 'reload' })}
            onClick={() => {
              //TODO: MUTATE TABLE VALUES HERE AND SEARCH AGAIN.
              alert('hello world');
            }}
          />
        </Box>
        {
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              alignItems: 'center',
              columnGap: 2,
            }}
          >
            {selectedClassroomsIds.length > 0 && showArchives && (
              <Button
                variant="outlined"
                color="warning"
                disabled={isArchiving || isUnarchiving}
                onClick={() => setIsConfirmUnarchiveDialogOpen(true)}
              >
                {formatMessage({ id: 'unarchiveSelected' })}
              </Button>
            )}
            {selectedClassroomsIds.length > 0 && !showArchives && (
              <Button
                variant="outlined"
                color="warning"
                disabled={isArchiving || isUnarchiving}
                onClick={() => setIsConfirmArchiveDialogOpen(true)}
              >
                {formatMessage({ id: 'archiveSelected' })}
              </Button>
            )}
            <TableHeaderItem
              icon={filter}
              title={formatMessage({ id: 'filter' })}
              onClick={(event) => {
                setFilterAnchorEl(event.currentTarget);
              }}
            />
          </Box>
        }
      </Box>
      <TableContainer
        sx={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  padding: '8.5px',
                },
              }}
            >
              {tableHeaders.map((columnTitle, index) => (
                <TableCell key={index} align="left">
                  {index === 0 ? (
                    <Checkbox
                      disabled={
                        !classroomData ||
                        isClassroomDataFetching ||
                        isArchiving ||
                        isUnarchiving
                      }
                      onClick={() =>
                        isArchiving || isUnarchiving
                          ? null
                          : selectAllClassrooms()
                      }
                      checked={
                        !!classroomData &&
                        selectedClassroomsIds.length === classroomData.length
                      }
                      icon={
                        <Icon
                          icon={unchecked}
                          style={{
                            color: '#D1D5DB',
                            height: '100%',
                            width: '21px',
                          }}
                        />
                      }
                      checkedIcon={
                        <Icon
                          icon={checked}
                          style={{
                            color: theme.palette.primary.main,
                            height: '100%',
                            width: '21px',
                          }}
                        />
                      }
                      indeterminate={
                        selectedClassroomsIds.length > 1 &&
                        selectedClassroomsIds.length < classroomData.length
                      }
                    />
                  ) : index > 0 && columnTitle === '' ? (
                    ''
                  ) : index === 3 ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        justifyItems: 'start',
                        alignItems: 'center',
                        columnGap: 0.3,
                      }}
                    >
                      {formatMessage({ id: columnTitle })}
                      <Tooltip
                        placement="top"
                        title={formatMessage({
                          id: 'numberOfDivisionsExplanation',
                        })}
                      >
                        <IconButton size="small">
                          <Icon icon={questionMark} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    formatMessage({ id: columnTitle })
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!classroomData || isClassroomDataFetching ? (
              <TableSkeleton hasCheckbox hasMore />
            ) : classroomData.length === 0 ? (
              <NoTableElement />
            ) : (
              classroomData.map((classroom, index) => {
                const {
                  annual_classroom_id,
                  classroom_acronym,
                  classroom_name,
                  number_of_divisions,
                  is_deleted,
                } = classroom;
                return (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '& td': {
                        padding: '7px',
                      },
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedClassroomsIds.includes(
                          annual_classroom_id
                        )}
                        onClick={() => selectMajor(annual_classroom_id)}
                        icon={
                          <Icon
                            icon={unchecked}
                            style={{
                              color: '#D1D5DB',
                              height: '100%',
                              width: '21px',
                            }}
                          />
                        }
                        checkedIcon={
                          <Icon
                            icon={checked}
                            style={{
                              color: theme.palette.primary.main,
                              height: '100%',
                              width: '21px',
                            }}
                          />
                        }
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: is_deleted
                          ? theme.common.line
                          : theme.common.body,
                      }}
                    >
                      {classroom_acronym}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: is_deleted
                          ? theme.common.line
                          : theme.common.body,
                      }}
                    >
                      {classroom_name}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: is_deleted
                          ? theme.common.line
                          : theme.common.body,
                      }}
                    >
                      {formatNumber(number_of_divisions)}
                    </TableCell>
                    <TableCell align="right">
                      {selectedClassroomsIds.length > 0 ? (
                        ''
                      ) : (
                        <Tooltip arrow title={formatMessage({ id: 'more' })}>
                          <IconButton
                            size="small"
                            disabled={isArchiving || isUnarchiving}
                            onClick={(event) => {
                              if (isArchiving || isUnarchiving) return null;
                              setAnchorEl(event.currentTarget);
                              setActiveClassroomId(annual_classroom_id);
                              setIsActiveClassroomArchived(is_deleted);
                            }}
                          >
                            <Icon icon={more} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
