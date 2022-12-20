import {
  KeyboardArrowDownOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import { Box, Button, Chip, lighten, Skeleton, Tooltip } from '@mui/material';
import { CreateWeightingSystem } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import MoreMenu from './moreMenu';
import SwapWeightingSystemMenu from './swapWeightingSystemMenu';

export default function WeightingActionBar({
  weightingSystem,
  isDataLoading,
  editWeightingSystem,
  openCarryOverDialog,
  openEvaluationWeightingDialog,
  openExamAccessDialog,
}: {
  weightingSystem: number | undefined;
  isDataLoading: boolean;
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
          justifyContent: 'end',
          // gridTemplateColumns: 'auto 1fr',
          columnGap: theme.spacing(1),
        }}
      >
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
