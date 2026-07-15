'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMusic } from '@/components/music-provider';
import { useSiteSettings } from '@/components/site-settings-provider';
import { WeddingImage } from '@/components/wedding-image';

export function OpeningCard() {
  const router = useRouter();
  const { startMusic } = useMusic();
  const { settings, isLoading } = useSiteSettings();
  const [isOpening, setIsOpening] = useState(false);
  const [guestName, setGuestName] = useState('Bạn và gia đình');

  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get('khach')?.trim();
    if (name) setGuestName(name.slice(0, 80));
  }, []);

  const handleOpen = async () => {
    setIsOpening(true);
    void startMusic();
    window.setTimeout(() => router.push(`/invitation${window.location.search}`), 1250);
  };

  return (
    <main className="luxe-bg relative min-h-screen overflow-hidden px-4 py-8 text-ink">
      <WeddingImage src={isLoading ? null : settings.coverImage} fallbackSrc="/images/luxe-hero.svg" alt="Ảnh cưới mở đầu" fill priority sizes="100vw" className="object-cover opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,.72),transparent_42%),linear-gradient(145deg,rgba(255,255,255,.94),rgba(255,241,244,.9))]" />
      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-4xl flex-col items-center justify-center text-center">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-wine">Thiệp mời ngày cưới</p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl">{settings.brideName} <span className="text-clay">&</span> {settings.groomName}</h1>
        <p className="mt-2 text-sm font-bold text-ink/60">{settings.displayDate}</p>
        <div className="envelope-stage mt-16 sm:mt-20">
          <div className={`envelope-shell ${isOpening ? 'is-opening' : ''}`}>
            <div className="envelope-back rounded-lg" />
            <div className="envelope-letter flex flex-col items-center justify-center rounded-lg px-6 pb-8 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-wine">Hẹn ngày chung vui</p>
              <p className="mt-3 font-display text-3xl sm:text-5xl">{settings.fullTitle}</p>
              <p className="mt-4 text-sm font-bold text-ink/60">{settings.displayDate}</p>
            </div>
            <div className="envelope-flap rounded-lg" />
            <div className="envelope-front rounded-lg" />
            <div className="envelope-recipient absolute inset-x-8 bottom-[12%] z-[6] text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-wine">Trân trọng kính mời</p>
            </div>
          </div>
        </div>
        <button type="button" onClick={handleOpen} disabled={isOpening} className="relative z-20 mt-8 min-h-14 min-w-60 rounded-lg bg-wine px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-glow transition hover:-translate-y-1 hover:bg-clay disabled:cursor-wait disabled:opacity-70">
          {isOpening ? 'Đang mở thiệp...' : 'Mở thiệp cưới'}
        </button>
      </section>
    </main>
  );
}
