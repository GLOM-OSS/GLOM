import { useActiveLanguage, useDispatchLanguage, useTheme } from '@glom/theme';
import { Facebook, LinkedIn, Twitter, YouTube } from '@mui/icons-material';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  capitalize,
} from '@mui/material';
import { useIntl } from 'react-intl';

export default function Footer() {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const changeLanguage = useDispatchLanguage();
  const activeLanguage = useActiveLanguage();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: 1,
        borderTop: `1px solid ${theme.common.line}`,
        padding: { desktop: '8px 16px 8px 16px', mobile: '8px' },
        alignItems: 'center',
      }}
    >
      <Typography>&copy; GLOM LLC</Typography>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          alignItems: 'center',
          columnGap: 0.5,
        }}
      >
        <LinkedIn sx={{ color: theme.common.label }} fontSize="medium" />
        <Facebook sx={{ color: theme.common.label }} fontSize="medium" />
        <Twitter sx={{ color: theme.common.label }} fontSize="medium" />
        <YouTube sx={{ color: theme.common.label }} fontSize="medium" />
        <FormControl
          fullWidth
          sx={{
            '& .MuiSelect-select': {
              paddingTop: 1,
              paddingBottom: 1,
            },
          }}
        >
          <Select
            value={activeLanguage}
            size="small"
            onChange={() => {
              changeLanguage({
                type:
                  capitalize(activeLanguage) === 'En'
                    ? 'USE_FRENCH'
                    : 'USE_ENGLISH',
              });
            }}
          >
            <MenuItem value={'en'}>{formatMessage({ id: 'en' })}</MenuItem>
            <MenuItem value={'fr'}>{formatMessage({ id: 'fr' })}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
