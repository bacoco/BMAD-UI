import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

// Create a test query client with default options
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

// Wrapper with all necessary providers
export function AllTheProviders({ children }: AllTheProvidersProps) {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <TooltipProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Custom render function
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
