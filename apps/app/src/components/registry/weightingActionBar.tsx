import {
  KeyboardArrowDownOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  lighten,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { CreateWeightingSystem, Cycle } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import MoreMenu from './moreMenu';
import SwapWeightingSystemMenu from './swapWeightingSystemMenu';

export default function WeightingActionBar({
  cycles,
  activeCycleId,
  weightingSystem,
  isDataLoading,
  swapActiveCycle,
  editWeightingSystem,
  openCarryOverDialog,
  openEvaluationWeightingDialog,
  openExamAccessDialog,
}: {
  cycles: Cycle[];
  activeCycleId: string;
  weightingSystem: number | undefined;
  isDataLoading: boolean;
  swapActiveCycle: (newActiveCycleId: string) => void;
  editWeightingSystem: (newWeightingSystem: CreateWeightingSystem) => void;
  openCarryOverDialog: () => void;
  openEvaluationWeightingDialog: () => void;
  openExamAccessDialog: () => void;
}) {
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLAnchorElement | null>(
    null
  );

  return (
    <>
      <SwapWeightingSystemMenu
        editWeightingSystem={(newWeightingSystem: number) =>
          editWeightingSystem({
            weighting_system: newWeightingSystem,
          })
        }
        anchorEl={anchorEl}
        isDataLoading={isDataLoading}
        setAnchorEl={setAnchorEl}
        weightingSystem={weightingSystem}
      />
      <MoreMenu
        anchorEl={moreAnchorEl}
        openCarryOverDialog={openCarryOverDialog}
        openEvaluationWeightingDialog={openEvaluationWeightingDialog}
        openExamAccessDialog={openExamAccessDialog}
        setAnchorEl={setMoreAnchorEl}
      />
      <Box
        sx={{
          marginTop: theme.spacing(1),
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: theme.spacing(1),
        }}
      >
        <FormControl>
          <InputLabel id="cycle">{formatMessage({ id: 'cycle' })}</InputLabel>
          <Select
            size="small"
            labelId="cycle"
            disabled={isDataLoading}
            onChange={(event) => swapActiveCycle(event.target.value)}
            value={activeCycleId}
            input={<OutlinedInput label={formatMessage({ id: 'cycle' })} />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                },
              },
            }}
          >
            {cycles.map(
              ({ cycle_id, cycle_name, number_of_years: noy }, index) => (
                <MenuItem key={index} value={cycle_id}>
                  {`${cycle_name}(${noy} ${formatMessage({ id: 'years' })})`}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            columnGap: theme.spacing(1),
            alignItems: 'center',
            justifySelf: 'end',
          }}
        >
          <Chip
            sx={{ backgroundColor: lighten(theme.palette.success.main, 0.6) }}
            onDelete={
              weightingSystem && !isDataLoading
                ? (event) => setAnchorEl(event.target)
                : undefined
            }
            deleteIcon={<KeyboardArrowDownOutlined />}
            label={
              weightingSystem ? (
                `${formatMessage({ id: 'weightingOn' })} ${weightingSystem}`
              ) : (
                <Skeleton
                  animation="wave"
                  sx={{ minWidth: theme.spacing(10) }}
                />
              )
            }
          />
          <Button
            variant="contained"
            size="small"
            color="inherit"
            disabled={isDataLoading}
            onClick={(event) =>
              setMoreAnchorEl(event.target as HTMLAnchorElement)
            }
          >
            <Tooltip arrow title={formatMessage({ id: 'more' })}>
              <MoreHorizOutlined />
            </Tooltip>
          </Button>
        </Box>
      </Box>
    </>
  );
}
