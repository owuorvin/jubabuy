
'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: (failureCount, error) => {
        // Retry fewer times for network errors
        if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
          return failureCount < 2;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      // Network mode for better offline handling
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          {children}
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
// 'use client';

// import { AppProvider } from '@/contexts/AppContext';
// import { AuthProvider } from '@/hooks/useAuth';

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <AuthProvider>
//       <AppProvider>
//         {children}
//       </AppProvider>
//     </AuthProvider>
//   );
// }