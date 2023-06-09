import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function Features() {
  const { push } = useRouter();
  useEffect(() => {
    push('/demand');
  }, [push]);
  return <div>Features</div>;
}
