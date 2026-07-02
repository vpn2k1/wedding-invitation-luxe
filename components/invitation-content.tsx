'use client';

import { AlbumPreview } from '@/components/album-preview';
import { CommentSection } from '@/components/comment-section';
import { CoupleSection } from '@/components/couple-section';
import { EventsSection } from '@/components/events-section';
import { HeroSection } from '@/components/hero-section';
import { MusicToggle } from '@/components/music-toggle';
import { QrSection } from '@/components/qr-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { TimelineSection } from '@/components/timeline-section';
import { useSiteSettings } from '@/components/site-settings-provider';

export function InvitationContent() {
  const { settings } = useSiteSettings();

  return (
    <>
      <SiteHeader />
      <HeroSection />
      <CoupleSection />
      <EventsSection />
      {settings.layout.showTimeline && <TimelineSection />}
      {settings.layout.showAlbum && (
        <div id="album">
          <AlbumPreview />
        </div>
      )}
      {settings.layout.showQr && <QrSection />}
      {settings.layout.showComments && <CommentSection />}
      <SiteFooter />
      <MusicToggle />
    </>
  );
}
