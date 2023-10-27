import { MoreVertRounded } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  lighten,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { theme } from '@glom/theme';
import { random } from '@glom/utils';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

export const AcademicItemSkeleton = ({ hasChips }: { hasChips?: boolean }) => {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
        backgroundColor: lighten(theme.palette.primary.main, 0.9),
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
          >{`${formatMessage({ id: 'createdOn' })} : `}</Typography>
          <Typography variant="caption">
            <Skeleton sx={{ width: `60%` }} animation="wave" />
          </Typography>
        </Box>
        <IconButton>
          <Tooltip arrow title={formatMessage({ id: 'more' })}>
            <MoreVertRounded
              sx={{ fontSize: '20px', color: theme.common.titleActive }}
            />
          </Tooltip>
        </IconButton>
      </Box>
      <Typography sx={{ marginTop: theme.spacing(2) }}>
        <Skeleton sx={{ width: `${random() * 10}%` }} animation="wave" />
      </Typography>
      {hasChips && (
        <Box sx={{ marginTop: theme.spacing(2) }}>
          {[...new Array(2)].map((item, index) => (
            <Chip
              size="small"
              key={index}
              sx={{
                justifySelf: 'center',
                marginRight: theme.spacing(1),
              }}
              label={
                <Skeleton
                  sx={{ width: index === 0 ? '40px' : '120px' }}
                  animation="wave"
                />
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

interface AcadItemInterface {
  created_at: Date;
  item_acronym: string;
  item_name: string;
  is_archived: boolean;
  deleted_at?: Date;
  item_code: string;
}

export default function AcademicItem({
  handleEditClick,
  handleArchiveClick,
  handleUnarchiveClick,
  item: {
    created_at,
    item_acronym,
    item_name,
    is_archived,
    deleted_at,
    item_code,
  },
  chipItems,
  disableMenu,
  usage,
}: {
  handleEditClick: () => void;
  handleArchiveClick: () => void;
  handleUnarchiveClick: () => void;
  item: AcadItemInterface;
  chipItems?: string[];
  disableMenu: boolean;
  usage: 'department' | 'major';
}) {
  const { formatMessage, formatDate } = useIntl();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
      >
        {!is_archived && (
          <MenuItem
            onClick={() => {
              handleEditClick();
              setAnchorEl(null);
            }}
            sx={{ padding: theme.spacing(1), minHeight: 'fit-content' }}
          >
            {formatMessage({ id: 'edit' })}
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            is_archived ? handleUnarchiveClick() : handleArchiveClick();
            setAnchorEl(null);
          }}
          sx={{ padding: theme.spacing(1), minHeight: 'fit-content' }}
        >
          {formatMessage({ id: is_archived ? 'unarchive' : 'archive' })}
        </MenuItem>
        {usage === 'major' && (
          <MenuItem
            onClick={() => {
              navigate(item_code);
              setAnchorEl(null);
            }}
            sx={{ padding: theme.spacing(1), minHeight: 'fit-content' }}
          >
            {formatMessage({ id: 'manage' })}
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
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              disableMenu ? null : setAnchorEl(event.currentTarget)
            }
          >
            <Tooltip arrow title={formatMessage({ id: 'more' })}>
              <MoreVertRounded
                sx={{ fontSize: '20px', color: theme.common.titleActive }}
              />
            </Tooltip>
          </IconButton>
        </Box>
        <Typography sx={{ marginTop: theme.spacing(2) }}>
          {`${item_name} (${item_acronym})`}
        </Typography>
        {chipItems && (
          <Box sx={{ marginTop: theme.spacing(2) }}>
            {chipItems.map((item, index) => (
              <Chip
                size="small"
                key={index}
                sx={{
                  justifySelf: 'center',
                  marginRight: theme.spacing(1),
                  backgroundColor: lighten(
                    theme.palette[index === 0 ? 'primary' : 'secondary'].main,
                    0.6
                  ),
                }}
                label={item}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
