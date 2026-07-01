import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { MusicProvider } from '@/components/music-provider';

export const metadata: Metadata = {
  title: 'Thiệp cưới Hà Nhi & Phương Nam',
  description: 'Website thiệp cưới online phong cách luxe editorial, có trang mở thiệp, thông tin cưới, album storybook và lời chúc.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        <MusicProvider>{children}</MusicProvider>
      </body>
    </html>
  );
}
