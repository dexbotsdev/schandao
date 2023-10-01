import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'CAS MEV Tools',
  description: 'Maximum Extractable Income!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <ClerkProvider publishableKey='pk_test_cm9idXN0LXN0dXJnZW9uLTk1LmNsZXJrLmFjY291bnRzLmRldiQ'>
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider  defaultColorScheme="dark"
         theme={theme}>{children}</MantineProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
