import { useActiveLanguage, useDispatchLanguage, useTheme } from '@glom/theme';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  capitalize,
} from '@mui/material';
import { useIntl } from 'react-intl';
import Breadcrumb from './Breadcrumb';
import { useBreadcrumb } from '../breadcrumbContext/BreadcrumbContextProvider';
import { IAppType } from '@glom/squoolr-v2/auth-ui';
import Head from 'next/head';

export default function LayoutHeader({ callingApp }: { callingApp: IAppType }) {
  const { formatMessage } = useIntl();
  const changeLanguage = useDispatchLanguage();
  const activeLanguage = useActiveLanguage();
  const theme = useTheme();
  const breadcrumbItems = useBreadcrumb();

  return (
    <>
      <Head>
        <title>{`Squoolr ${callingApp} ${
          breadcrumbItems.length > 1 ? breadcrumbItems[1].title : ''
        }`}</title>
      </Head>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          columnGap: 1,
          alignItems: 'center',
          borderBottom: `1px solid ${theme.common.line}`,
          padding: '8px 40px',
        }}
      >
        <Box>
          <Typography variant="h1" sx={{ paddingBottom: '0 !important' }}>
            {breadcrumbItems.length > 1
              ? breadcrumbItems[1].title
              : formatMessage({ id: 'noTitleAvailable' })}
          </Typography>
          <Breadcrumb />
        </Box>
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
    </>
  );
}
