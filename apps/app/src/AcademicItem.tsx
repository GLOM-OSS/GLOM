import { MoreVertRounded } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  lighten,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';

interface AcadItemInterface {
  created_at: Date;
  item_code: string;
  item_name: string;
  is_archived: boolean;
  deleted_at?: Date;
}

export default function AcademicItem({
  handleEditClick,
  handleArchiveClick,
  item: { created_at, item_code, item_name, is_archived, deleted_at },
  chipItems,
}: {
  handleEditClick: () => void;
  handleArchiveClick: () => void;
  item: AcadItemInterface;
  chipItems?: string[];
}) {
  const { formatMessage, formatDate } = useIntl();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            handleEditClick();
            setAnchorEl(null);
          }}
          sx={{ padding: theme.spacing(1), minHeight: 'fit-content' }}
        >
          {formatMessage({ id: 'edit' })}
        </MenuItem>
        {!is_archived && (
          <MenuItem
            onClick={() => {
              handleArchiveClick();
              setAnchorEl(null);
            }}
            sx={{ padding: theme.spacing(1), minHeight: 'fit-content' }}
          >
            {formatMessage({ id: 'archive' })}
          </MenuItem>
        )}
      </Menu>
      <Box
        sx={{
          padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
          backgroundColor: lighten(
            theme.palette[is_archived ? 'error' : 'primary'].main,
            0.9
          ),
          borderRadius: '10px',
          color: theme.common.titleActive,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: theme.spacing(1.5),
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: theme.spacing(1),
              alignItems: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: theme.common.placeholder }}
            >{`${formatMessage({
              id:
                is_archived && Boolean(deleted_at) ? 'archivedOn' : 'createdOn',
            })} : `}</Typography>
            <Typography variant="caption">
              {formatDate(
                is_archived && Boolean(deleted_at) ? deleted_at : created_at,
                {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                }
              )}
            </Typography>
          </Box>
          <IconButton
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <Tooltip arrow title={formatMessage({ id: 'more' })}>
              <MoreVertRounded
                sx={{ fontSize: '20px', color: theme.common.titleActive }}
              />
            </Tooltip>
          </IconButton>
        </Box>
        <Typography sx={{ marginTop: theme.spacing(2) }}>
          {`${item_name} (${item_code})`}
        </Typography>
        {chipItems && (
          <Box sx={{ marginTop: theme.spacing(2) }}>
            {chipItems.map((item, index) => (
              <Chip
                size="small"
                sx={{
                  justifySelf: 'center',
                  marginRight: theme.spacing(1),
                  backgroundColor: lighten(
                    theme.palette[index === 0 ? 'primary' : 'secondary'].main,
                    0.6
                  ),
                }}
                label={formatMessage({ id: item })}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
