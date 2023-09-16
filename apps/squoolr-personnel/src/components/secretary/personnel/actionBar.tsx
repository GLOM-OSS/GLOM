import { AddRounded, SearchRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
} from '@mui/material';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';
import { TabItem } from './personnelTabs';

export default function ActionBar({
  handleAddClick,
  search: { searchValue, setSearchValue },
  activeTabItem,
  isSubmittingActionBarAction,
  archived: { showArchived, setShowArchived },
}: {
  handleAddClick: () => void;
  search: { searchValue: string; setSearchValue: (value: string) => void };
  activeTabItem: TabItem;
  isSubmittingActionBarAction: boolean;
  archived: {
    showArchived: boolean;
    setShowArchived: (isChecked: boolean) => void;
  };
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
          //   alignItems:'center'
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={showArchived}
              color="primary"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setShowArchived(event.target.checked)
              }
            />
          }
          label={formatMessage({ id: 'showArchived' })}
          sx={{ '& .MuiTypography-root': { ...theme.typography.body2 } }}
        />

        {activeTabItem !== 'allPersonnel' && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<AddRounded sx={{ fontSize: '24px' }} />}
            size="small"
            sx={{ textTransform: 'none' }}
            onClick={handleAddClick}
            disabled={isSubmittingActionBarAction}
          >
            {formatMessage({
              id:
                activeTabItem === 'coordinator'
                  ? 'addCoordinator'
                  : activeTabItem === 'teacher'
                  ? 'addTeacher'
                  : 'addStaff',
            })}
          </Button>
        )}
        <Button
          variant="contained"
          color="inherit"
          size="small"
          sx={{ textTransform: 'none' }}
          disabled={isSubmittingActionBarAction}
        >
          {formatMessage({ id: 'import' })}
        </Button>
        <Button
          variant="contained"
          color="inherit"
          size="small"
          sx={{ textTransform: 'none' }}
          disabled={isSubmittingActionBarAction}
        >
          {formatMessage({ id: 'export' })}
        </Button>
      </Box>
    </Box>
  );
}
