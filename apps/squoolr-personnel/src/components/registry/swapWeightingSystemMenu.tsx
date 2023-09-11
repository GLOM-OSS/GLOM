import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function SwapWeightingSystemMenu({
  isDataLoading,
  weightingSystem,
  anchorEl,
  setAnchorEl,
  editWeightingSystem,
}: {
  isDataLoading: boolean;
  weightingSystem: number | undefined;
  anchorEl: HTMLAnchorElement | null;
  setAnchorEl: (anchorEl: HTMLAnchorElement | null) => void;
  editWeightingSystem: (newWeightingSystem: number) => void;
}) {
  const { formatMessage } = useIntl();
  const [newWeightingSystem, setNewWeightingSystem] = useState<number>(
    weightingSystem as number
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={anchorEl !== null}
      onClose={() => setAnchorEl(null)}
    >
      <Box
        sx={{
          p: 1,
          display: 'grid',
          minWidth: 150,
          rowGap: theme.spacing(1),
        }}
      >
        <FormControl>
          <InputLabel id="weightingSystem">
            {formatMessage({ id: 'weightingSystem' })}
          </InputLabel>
          <Select
            labelId="weightingSystem"
            disabled={isDataLoading}
            value={newWeightingSystem}
            size="small"
            onChange={(event) =>
              setNewWeightingSystem(Number(event.target.value))
            }
            input={
              <OutlinedInput label={formatMessage({ id: 'weightingSystem' })} />
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                },
              },
            }}
          >
            {[...new Array(10)].map((_, index) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          disabled={isDataLoading || weightingSystem === newWeightingSystem}
          fullWidth
          sx={{ textTransform: 'none' }}
          onClick={() => {
            setAnchorEl(null);
            editWeightingSystem(newWeightingSystem);
          }}
        >
          {formatMessage({ id: 'save' })}
        </Button>
      </Box>
    </Menu>
  );
}
