import { IAppType } from '@glom/squoolr-v2/auth-ui';
import { useTheme } from '@glom/theme';
import { Box, Collapse, Typography } from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { INavSection } from './SideNav.interfaces';
import Header from './components/Header';
import SideNavItem from './components/SideNavItem';

export default function SideNav({
  callingApp,
  navSections,
}: {
  callingApp: IAppType;
  navSections: INavSection[];
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  return (
    <Box
      sx={{
        padding: '24px 16px',
        backgroundColor: theme.common.background,
        minWidth: isExpanded ? '282px' : 'fit-content',
        height: '100%',
        borderRight: `1px solid ${theme.common.line}`,
        position: 'relative',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header
        isExpanded={isExpanded}
        handleExpand={() => setIsExpanded((prev) => !prev)}
      />
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          rowGap: 4.5,
          alignContent: 'start',
        }}
      >
        {navSections.map(({ title, navItems }, index) => (
          <Box
            sx={{
              paddingTop: 3,
              borderTop: `1px solid ${theme.common.line}`,
              display: 'grid',
              rowGap: 1.5,
            }}
            key={index}
          >
            <Typography
              component={Collapse}
              in={isExpanded}
              orientation="horizontal"
              className="label2"
              sx={{ textTransform: 'uppercase', fontWeight: '500' }}
            >
              {title}
            </Typography>
            <Box sx={{ display: 'grid', rowGap: 2 }}>
              {navItems.map((item, index) => (
                <SideNavItem isExpanded={isExpanded} item={item} key={index} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {callingApp === 'Admin' && (
        <Typography
          component={Collapse}
          in={isExpanded}
          orientation="horizontal"
          variant="body2"
          sx={{ justifySelf: 'center', alignSelf: 'end', fontWeight: 400 }}
        >
          {formatMessage({ id: 'byGlom' })}
        </Typography>
      )}
    </Box>
  );
}
