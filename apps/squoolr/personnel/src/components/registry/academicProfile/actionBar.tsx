import { KeyboardArrowDownOutlined } from '@mui/icons-material';
import { Chip, lighten, Skeleton } from '@mui/material';
import { CreateWeightingSystem } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import SwapWeightingSystemMenu from '../swapWeightingSystemMenu';

export default function ActionBar({
  weightingSystem,
  isDataLoading,
  editWeightingSystem,
}: {
  weightingSystem: number | undefined;
  isDataLoading: boolean;
  editWeightingSystem: (newWeightingSystem: CreateWeightingSystem) => void;
}) {
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null);

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
      <Chip
        sx={{
          backgroundColor: lighten(theme.palette.success.main, 0.6),
          justifySelf: 'end',
        }}
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
            <Skeleton animation="wave" sx={{ minWidth: theme.spacing(10) }} />
          )
        }
      />
    </>
  );
}
