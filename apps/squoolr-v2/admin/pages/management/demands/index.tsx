import { NoTableElement } from '@glom/components';
import { DemandStatus, SchoolEntity } from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import reset from '@iconify/icons-fluent/arrow-counterclockwise-48-regular';
import filter from '@iconify/icons-fluent/filter-28-regular';
import search from '@iconify/icons-fluent/search-48-regular';
import { Icon, IconifyIcon } from '@iconify/react';
import {
  Box,
  Chip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import FilterMenu from '../../../component/management/demands/FilterMenu';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatchBreadcrumb } from '@glom/squoolr-v2/side-nav';
import { useRouter } from 'next/router';
import { useSchoolDemand, useSchoolDemands } from '@glom/data-access/squoolr';

function TableHeaderItem({
  title,
  icon,
  onClick,
}: {
  icon: IconifyIcon;
  title: string;
  onClick?: (event) => void;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        columnGap: 1,
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onClick={(event) => onClick(event)}
    >
      <Icon icon={icon} fontSize={20} />
      <Typography className="p4" sx={{ color: theme.common.body }}>
        {title}
      </Typography>
    </Box>
  );
}

export const STATUS_CHIP_VARIANT: Record<string, 'outlined' | 'filled'> = {
  PROCESSING: 'filled',
  PENDING: 'outlined',
  REJECTED: 'filled',
  VALIDATED: 'filled',
  SUSPENDED: 'outlined',
};
export const STATUS_CHIP_COLOR: Record<
  string,
  'primary' | 'secondary' | 'error' | 'success'
> = {
  PENDING: 'primary',
  PROCESSING: 'secondary',
  REJECTED: 'error',
  VALIDATED: 'success',
  SUSPENDED: 'error',
};

export function Index() {
  const theme = useTheme();
  const { push, asPath } = useRouter();
  const { formatMessage } = useIntl();

  const tableHeaders = [
    'code#',
    'schoolName',
    'email',
    'phone',
    'demandStatus',
  ];

  const breadcrumbDispatch = useDispatchBreadcrumb();

  const [canSearchExpand, setCanSearchExpand] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DemandStatus[]>([]);

  const {
    data: demandData,
    isFetching: isFetchingDemands,
    refetch: refetchDemands,
  } = useSchoolDemands(selectedStatus);

  function onChangeFilter(demandStatus: DemandStatus) {
    setSelectedStatus(
      selectedStatus.includes(demandStatus)
        ? selectedStatus.filter((element) => element !== demandStatus)
        : [...selectedStatus, demandStatus]
    );
  }

  return (
    <>
      <FilterMenu
        closeMenu={() => {
          setAnchorEl(null);
        }}
        isOpen={!!anchorEl}
        onSelect={onChangeFilter}
        anchorEl={anchorEl}
        selectedStatus={selectedStatus}
      />
      <Box>
        <Box
          sx={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            border: `1px solid ${theme.common.line}`,
            borderBottom: 'none',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            justifyItems: 'end',
            alignItems: 'center',
            padding: '16px',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: 2,
              alignItems: 'center',
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
              onClick={() => refetchDemands()}
            />
          </Box>
          <TableHeaderItem
            icon={filter}
            title={formatMessage({ id: 'filter' })}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
          />
        </Box>
        <TableContainer
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {tableHeaders.map((columnTitle, index) => (
                  <TableCell key={index} align="left">
                    {formatMessage({ id: columnTitle })}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetchingDemands || demandData.length === 0 ? (
                <NoTableElement />
              ) : (
                demandData.map(
                  (
                    {
                      school_id,
                      school_code,
                      school_name,
                      school_email,
                      school_phone_number,
                      school_demand_status,
                      school_acronym,
                    },
                    index
                  ) => (
                    <TableRow
                      hover
                      key={index}
                      onClick={() => {
                        push(`${asPath}/${school_id}`);
                        breadcrumbDispatch({
                          action: 'ADD',
                          payload: [
                            {
                              title: school_acronym,
                              route: `${asPath}/${school_id}`,
                            },
                          ],
                        });
                      }}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell>{school_code}</TableCell>
                      <TableCell>{school_name}</TableCell>
                      <TableCell>
                        <Typography
                          component="a"
                          href={`mailto:${school_email}`}
                          target="_blank"
                          style={{
                            color: theme.palette.primary.main,
                          }}
                        >
                          {school_email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {school_phone_number
                          .split('+')[1]
                          .replace(/(.{3})/g, ' $1')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant={STATUS_CHIP_VARIANT[school_demand_status]}
                          color={STATUS_CHIP_COLOR[school_demand_status]}
                          label={formatMessage({
                            id: school_demand_status.toLowerCase(),
                          })}
                          sx={{
                            ...(school_demand_status === 'VALIDATED'
                              ? { color: 'white' }
                              : {}),
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default Index;
