import { TableHeaderItem } from '@glom/components';
import { useTheme } from '@glom/theme';
import reset from '@iconify/icons-fluent/arrow-counterclockwise-48-regular';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import filter from '@iconify/icons-fluent/filter-28-regular';
import search from '@iconify/icons-fluent/search-48-regular';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function TableHeader({
  searchValue,
  setSearchValue,
  showArchives,
  setShowArchives,
  numberOfSelectedStaffIds,
  disabled,
  canResetPrivateCode,
  setFilterAnchorEl,
  resetPassword,
  banUsers,
  unbanUsers,
  resetPrivateCode,
}: {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  disabled: boolean;
  showArchives: boolean;
  setShowArchives: (showArchives: boolean) => void;
  numberOfSelectedStaffIds: number;
  canResetPrivateCode: boolean;
  setFilterAnchorEl: (element: HTMLElement) => void;
  resetPassword: () => void;
  banUsers: () => void;
  unbanUsers: () => void;
  resetPrivateCode: () => void;
}) {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const [canSearchExpand, setCanSearchExpand] = useState<boolean>(false);
  return (
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
            !searchValue ? setCanSearchExpand(false) : setCanSearchExpand(true)
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
          {numberOfSelectedStaffIds > 0 && !showArchives && (
            <Button
              variant="outlined"
              color="warning"
              disabled={disabled}
              onClick={banUsers}
            >
              {formatMessage({ id: 'banSelectedStaff' })}
            </Button>
          )}
          {numberOfSelectedStaffIds > 0 && showArchives && (
            <Button
              variant="outlined"
              color="warning"
              disabled={disabled}
              onClick={unbanUsers}
            >
              {formatMessage({ id: 'unBanSelectedStaff' })}
            </Button>
          )}
          {numberOfSelectedStaffIds > 0 &&
            !showArchives &&
            canResetPrivateCode && (
              <Button
                variant="outlined"
                color="warning"
                disabled={disabled}
                onClick={resetPrivateCode}
              >
                {formatMessage({ id: 'resetSelectedStaffPrivateCode' })}
              </Button>
            )}
          {numberOfSelectedStaffIds > 0 && !showArchives && (
            <Button
              variant="outlined"
              color="warning"
              disabled={disabled}
              onClick={resetPassword}
            >
              {formatMessage({ id: 'resetSelectedStaffPasswords' })}
            </Button>
          )}
          <Stack
            direction="row"
            spacing={0}
            alignItems={'center'}
            onClick={() => (disabled ? null : setShowArchives(!showArchives))}
            sx={{ cursor: 'pointer' }}
          >
            <Checkbox
              checked={showArchives}
              icon={
                <Icon
                  icon={unchecked}
                  style={{
                    color: '#D1D5DB',
                    height: '100%',
                    width: '24px',
                  }}
                />
              }
              checkedIcon={
                <Icon
                  icon={checked}
                  style={{
                    color: theme.palette.primary.main,
                    height: '100%',
                    width: '24px',
                  }}
                />
              }
            />
            <Typography
              sx={{
                color: showArchives
                  ? theme.palette.primary.main
                  : theme.common.body,
                '&:hover': {
                  color: theme.palette.primary.dark,
                },
              }}
            >
              {formatMessage({ id: 'showArchived' })}
            </Typography>
          </Stack>

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
  );
}
