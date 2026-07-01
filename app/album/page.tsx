import { Suspense } from 'react';
import { AlbumStorybook } from '@/components/album-storybook';
import { MusicToggle } from '@/components/music-toggle';
import { SiteHeader } from '@/components/site-header';

export default function AlbumPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<main className="luxe-bg min-h-screen px-5 pt-28">Đang tải album...</main>}>
        <AlbumStorybook />
      </Suspense>
      <MusicToggle />
    </>
  );
}
