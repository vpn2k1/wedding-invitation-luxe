import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { MusicProvider } from '@/components/music-provider';
import { SiteSettingsProvider } from '@/components/site-settings-provider';

export const metadata: Metadata = {
  title: 'Thiệp cưới Cô dâu & Chú rể',
  description: 'Website thiệp cưới online phong cách luxe editorial, có trang mở thiệp, thông tin cưới, album storybook và lời chúc.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        <SiteSettingsProvider>
          <MusicProvider>{children}</MusicProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
