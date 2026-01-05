'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from '@/components';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <Layout>
        {children}
      </Layout>
    </ThemeProvider>
  );
}
