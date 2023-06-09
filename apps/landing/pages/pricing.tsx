import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function Pricing() {
  const { push } = useRouter();
  useEffect(() => {
    push('/demand');
  }, [push]);
  return <div>Pricing</div>;
}
