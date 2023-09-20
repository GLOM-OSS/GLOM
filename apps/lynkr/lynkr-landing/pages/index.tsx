import { Box, Button, Typography } from '@mui/material';

export function Index() {
  return (
    <Box sx={{ height: '100%' }}>
      <Box
      // sx={{
      //   display: 'grid',
      //   gridTemplateRows: 'auto auto 1fr',
      //   rowGap: '30px',
      //   height: '100%',
      //   padding: '0 16px',
      // }}
      >
        <Typography className="h1--mobile">Lynkr</Typography>
        <Typography className="p1--space">Lynkr number 2</Typography>
        <Button color="secondary" variant="contained">
          Hello
        </Button>
      </Box>
    </Box>
  );
}

export default Index;
