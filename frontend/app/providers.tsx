'use client';

import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { RootState } from './store/store';

function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false); // Track whether the component is rendered on the client

  // Only call `useSelector` after confirming client-side render
  const mode = useSelector((state: RootState) => state.theme.mode);

  // Memoize the theme object to avoid unnecessary re-renders
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
    },
  }), [mode]);

  // Set the client flag to true once the component is mounted
  useEffect(() => {
    setIsClient(true); // This will trigger a re-render once mounted on the client
  }, []);

  // Render null before client-side rendering to avoid SSR mismatch
  if (!isClient) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        {children}
      </MuiThemeProvider>
    </Provider>
  );
}
