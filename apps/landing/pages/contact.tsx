import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function Contact() {
  const { push } = useRouter();
  if (push) push('/demand');
  useEffect(() => {
    push('/demand');
  }, [push]);
  return <div>Contact Us</div>;
}
