import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function Index() {
  const { push } = useRouter();
  useEffect(() => {
    push('/management');
  }, []);

  return <Box></Box>;
}

export default Index;