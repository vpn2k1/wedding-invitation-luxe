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

export default function InvitationPage() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <CoupleSection />
      <EventsSection />
      <TimelineSection />
      <div id="album">
        <AlbumPreview />
      </div>
      <QrSection />
      <CommentSection />
      <SiteFooter />
      <MusicToggle />
    </>
  );
}
