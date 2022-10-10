import { AddRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function ActionBar({
  handleAddClick,
  search: { searchValue, setSearchValue },
}: {
  handleAddClick: () => void;
  search: { searchValue: string; setSearchValue: (value: string) => void };
}) {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: theme.spacing(5),
      }}
    >
      <TextField
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded
                sx={{ color: theme.common.placeholder, fontSize: '24px' }}
              />
            </InputAdornment>
          ),
        }}
        size="small"
        placeholder={formatMessage({ id: 'search' })}
        sx={{ width: '80%' }}
      />
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: theme.spacing(2),
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          startIcon={<AddRounded sx={{ fontSize: '24px' }} />}
          size="small"
          sx={{ textTransform: 'none' }}
          onClick={handleAddClick}
        >
          {formatMessage({ id: 'add' })}
        </Button>
        <Button
          variant="contained"
          color="inherit"
          size="small"
          sx={{ textTransform: 'none' }}
        >
          {formatMessage({ id: 'import' })}
        </Button>
        <Button
          variant="contained"
          color="inherit"
          size="small"
          sx={{ textTransform: 'none' }}
        >
          {formatMessage({ id: 'export' })}
        </Button>
      </Box>
    </Box>
  );
}
