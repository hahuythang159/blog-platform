import FloatingSettings from './components/user/FloatingSettings';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <FloatingSettings />
        </Providers>
      </body>
    </html>
  );
}
