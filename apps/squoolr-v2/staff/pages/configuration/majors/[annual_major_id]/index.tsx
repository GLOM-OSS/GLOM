import {
  ConfirmDialog,
  NoTableElement,
  TableHeaderItem,
  TableSkeleton,
} from '@glom/components';
import {
  useClassrooms,
  useDisableClassrooms,
  useMajor,
} from '@glom/data-access/squoolr';
import {
  useBreadcrumb,
  useDispatchBreadcrumb,
} from '@glom/squoolr-v2/side-nav';
import { useTheme } from '@glom/theme';
import reset from '@iconify/icons-fluent/arrow-counterclockwise-48-regular';
import questionMark from '@iconify/icons-fluent/book-question-mark-24-regular';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import filter from '@iconify/icons-fluent/filter-28-regular';
import more from '@iconify/icons-fluent/more-vertical-48-regular';
import search from '@iconify/icons-fluent/search-48-regular';
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

  const { data: majorData } = useMajor(annual_major_id as string);

  useEffect(() => {
    if (!!annual_major_id) {
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

  const [searchValue, setSearchValue] = useState<string>('');
  const [showArchives, setShowArchives] = useState<boolean>(false);
  const {
    data: classroomData,
    isFetching: isClassroomDataFetching,
    refetch: refetchClassrooms,
  } = useClassrooms({
    annual_major_id: annual_major_id as string,
    is_deleted: showArchives,
    keywords: searchValue,
  });

  const [canSearchExpand, setCanSearchExpand] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );

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

  const { mutate: archiveClassrooms, isPending: isHandlingArchive } =
    useDisableClassrooms();
  function confirmArchiveUnarchive() {
    archiveClassrooms(
      selectedClassroomsIds.length > 1
        ? selectedClassroomsIds
        : [activeClassroomId],
      {
        onSuccess() {
          (isConfirmArchiveDialogOpen
            ? setIsConfirmArchiveDialogOpen
            : setIsConfirmUnarchiveDialogOpen)(false);
          setActiveClassroomId(undefined);
        },
      }
    );
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
        isSubmitting={isHandlingArchive}
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
            onClick={() => refetchClassrooms()}
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
                disabled={isHandlingArchive}
                onClick={() => setIsConfirmUnarchiveDialogOpen(true)}
              >
                {formatMessage({ id: 'unarchiveSelected' })}
              </Button>
            )}
            {selectedClassroomsIds.length > 0 && !showArchives && (
              <Button
                variant="outlined"
                color="warning"
                disabled={isHandlingArchive}
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
                        isHandlingArchive
                      }
                      onClick={() =>
                        isHandlingArchive ? null : selectAllClassrooms()
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
                            disabled={isHandlingArchive}
                            onClick={(event) => {
                              if (isHandlingArchive) return null;
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
