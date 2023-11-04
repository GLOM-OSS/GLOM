import { NoTableElement } from '@glom/components';
import { SchoolEntity } from '@glom/data-types/squoolr';
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
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

function TableHeaderItem({
  title,
  icon,
  onClick,
}: {
  icon: IconifyIcon;
  title: string;
  onClick?: () => void;
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
      onClick={onClick}
    >
      <Icon icon={icon} fontSize={20} />
      <Typography className="p4" sx={{ color: theme.common.body }}>
        {title}
      </Typography>
    </Box>
  );
}

export function Index() {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const tableHeaders = [
    'code#',
    'schoolName',
    'email',
    'phone',
    'demandStatus',
  ];

  //TODO: FETCH LIST OF DEMANDS HERE
  const demandData: SchoolEntity[] = [
    {
      school_acronym: 'UdM',
      school_name: 'Université des Montagnes',
      school_email: 'info@udm.com',
      school_phone_number: '+237657140183',
      school_demand_status: 'PROCESSING',
      ambassador_email: 'lorraintchakoumi@gmail.com',
      lead_funnel: 'Facebook',
      paid_amount: 0,
      school_code: 'KIS234',
      school_rejection_reason: '',
    },
    {
      school_acronym: 'SBAHS',
      school_name: 'Standard Bilingual Academy of Health Sciences',
      school_email: 'info@sbahs.com',
      school_phone_number: '+237657140183',
      school_demand_status: 'VALIDATED',
      ambassador_email: 'lorraintchakoumi@gmail.com',
      lead_funnel: 'Facebook',
      paid_amount: 0,
      school_code: 'KIS235',
      school_rejection_reason: '',
    },
    {
      school_acronym: 'SAJOHIM',
      school_name: 'Saint. Joan Higher Instistue of Health and Management',
      school_email: 'info@sajohim.com',
      school_phone_number: '+237657140183',
      school_demand_status: 'PENDING',
      ambassador_email: 'lorraintchakoumi@gmail.com',
      lead_funnel: 'Facebook',
      paid_amount: 0,
      school_code: 'KIS234',
      school_rejection_reason: '',
    },
  ];

  const STATUS_CHIP_VARIANT: Record<string, 'outlined' | 'filled'> = {
    PROCESSING: 'filled',
    PENDING: 'outlined',
    REJECTED: 'filled',
    VALIDATED: 'filled',
    SUSPENDED: 'outlined',
  };
  const STATUS_CHIP_COLOR: Record<
    string,
    'primary' | 'secondary' | 'error' | 'success'
  > = {
    PENDING: 'primary',
    PROCESSING: 'secondary',
    REJECTED: 'error',
    VALIDATED: 'success',
    SUSPENDED: 'error',
  };

  const [canSearchExpand, setCanSearchExpand] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    //TODO: CALL SEARCH API HERE. MUTATE DEMAND DATA WHEN IT'S DONE
  }, [searchValue]);

  return (
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
            placeholder="Search"
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
            title="Reload"
            onClick={() => {
              //TODO: MUTATE TABLE VALUES HERE AND SEARCH AGAIN.
              alert('hello world');
            }}
          />
        </Box>
        <TableHeaderItem icon={filter} title="Filter" />
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
            {demandData.length === 0 ? (
              <NoTableElement />
            ) : (
              demandData.map(
                (
                  {
                    school_code,
                    school_name,
                    school_email,
                    school_phone_number,
                    school_demand_status,
                  },
                  index
                ) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
  );
}

export default Index;
