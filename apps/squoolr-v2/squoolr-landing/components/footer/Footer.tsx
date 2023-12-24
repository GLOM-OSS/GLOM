import { useActiveLanguage, useDispatchLanguage, useTheme } from '@glom/theme';
import down from '@iconify/icons-fluent/chevron-down-28-filled';
import { Icon } from '@iconify/react';
import { Facebook, LinkedIn, Twitter, YouTube } from '@mui/icons-material';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  capitalize,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { LogoHolder } from '../navigation/Navbar';

export function Footer({
  openContactUs,
  openEarlyAccess,
  canDemand = false,
}: {
  openContactUs: () => void;
  openEarlyAccess: () => void;
  canDemand?: boolean;
}) {
  const theme = useTheme();
  const { push } = useRouter();
  const { formatMessage } = useIntl();
  const changeLanguage = useDispatchLanguage();
  const activeLanguage = useActiveLanguage();

  return (
    <Box
      sx={{
        padding: {
          mobile: '25px 16px 25px 16px',
          desktop: '36px 118px 36px 118px',
        },
        backgroundColor: theme.common.titleActive,
        color: 'white',
        display: 'grid',
        rowGap: 4,
      }}
    >
      <Box
        sx={{
          padding: {
            mobile: '25px 16px 25px 16px',
            desktop: '36px 118px 36px 118px',
          },
          backgroundColor: theme.common.titleActive,
          color: 'white',
          display: 'grid',
          gridAutoFlow: { mobile: 'row', tablet: 'column' },
          alignItems: 'start',
          rowGap: 4,
        }}
      >
        <Box sx={{ display: 'grid', rowGap: 0.5 }}>
          <LogoHolder color="white" />
          <Typography
            sx={{ fontSize: '10px' }}
          >{`@Squoolr ~ ${new Date().getFullYear()}`}</Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { tablet: '1fr 1fr 1fr', mobile: '1fr 1fr' },
            rowGap: 4,
            alignItems: 'start',
          }}
        >
          <Box sx={{ display: 'grid', rowGap: 1.5 }}>
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {formatMessage({ id: 'products' })}
            </Typography>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <Typography
                component="a"
                href={'/'}
                style={{
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
              >
                Squoolr
              </Typography>
              <Typography
                component="a"
                href={'https://lynkr.net'}
                style={{
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
              >
                Lynkr
              </Typography>
              <Typography
                component="a"
                href={'/'}
                style={{
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
              >
                Ricly (Coming Soon)
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', rowGap: 1.5 }}>
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {formatMessage({ id: 'getInTouch' })}
            </Typography>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              <Typography
                component="a"
                href={'mailto:contact@xafshop.com'}
                target="_blank"
                style={{
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
              >
                {`${formatMessage({ id: 'email' })}: contact@squoolr.com`}
              </Typography>
              <Typography
                component="a"
                href={'tel:(+237) 681 382 151'}
                style={{
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
              >{`${formatMessage({
                id: 'phone',
              })}: (+237) 681 382 151`}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', rowGap: 1.5 }}>
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {formatMessage({ id: 'resources' })}
            </Typography>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
              {canDemand && (
                <Typography
                  sx={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    lineHeight: '160%',
                  }}
                  onClick={() => push('/demand')}
                >
                  {formatMessage({ id: 'createYourSchool' })}
                </Typography>
              )}
              <Typography
                sx={{
                  cursor: 'pointer',
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
                onClick={openEarlyAccess}
              >
                {formatMessage({ id: 'getEarlyAccess' })}
              </Typography>
              <Typography
                sx={{
                  cursor: 'pointer',
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
                onClick={openContactUs}
              >
                {formatMessage({
                  id: 'contactUs',
                })}
              </Typography>
              <Typography
                component="a"
                target="_blank"
                href="https://terms.squoolr.com"
                sx={{
                  cursor: 'pointer',
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
              >
                {formatMessage({
                  id: 'termsOfUse',
                })}
              </Typography>
              <Typography
                component="a"
                href={'https://policy.squoolr.com'}
                target="_blank"
                style={{
                  fontSize: '12px',
                  lineHeight: '160%',
                }}
              >
                {formatMessage({
                  id: 'privacyPolicy',
                })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          borderBottom: `1px solid ${theme.common.line}`,
          paddingBottom: 1,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
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
          <LinkedIn sx={{ color: 'white' }} fontSize="medium" />
          <Facebook sx={{ color: 'white' }} fontSize="medium" />
          <Twitter sx={{ color: 'white' }} fontSize="medium" />
          <YouTube sx={{ color: 'white' }} fontSize="medium" />
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
              sx={{ color: 'white' }}
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
    </Box>
  );
}
