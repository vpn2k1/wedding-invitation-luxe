'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMusic } from '@/components/music-provider';
import { weddingConfig } from '@/lib/wedding-data';

export function OpeningCard() {
  const router = useRouter();
  const { startMusic } = useMusic();
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = async () => {
    setIsOpening(true);
    await startMusic();
    window.setTimeout(() => router.push('/invitation'), 920);
  };

  return (
    <main className="luxe-bg relative min-h-screen overflow-hidden px-5 py-8 text-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-champagne/30 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-[28rem] w-[28rem] rounded-full bg-wine/12 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dune/20 animate-slowSpin" />
      </div>

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.52em] text-dune">Private Wedding Invitation</p>
          <h1 className="font-display text-6xl leading-[0.86] text-plum md:text-8xl lg:text-9xl">
            {weddingConfig.brideName}
            <span className="block text-4xl italic text-clay md:text-6xl">and</span>
            {weddingConfig.groomName}
          </h1>
          <div className="gold-line my-8 max-w-xl" />
          <p className="mx-auto max-w-xl text-lg leading-9 text-ink/68 lg:mx-0">{weddingConfig.quote}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <span className="rounded-full border border-dune/30 bg-white/55 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-plum shadow-soft">
              {weddingConfig.shortDate}
            </span>
            <span className="text-sm font-semibold text-ink/50">Ấn mở thiệp để phát nhạc nền</span>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-xl lg:order-2">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3.2rem] bg-gradient-to-br from-champagne/40 via-white/30 to-wine/10 blur-2xl" />
            <div
              className={`ornament-corners relative overflow-hidden rounded-[3rem] border border-white/80 bg-white/45 p-3 shadow-glow backdrop-blur-xl transition duration-700 ${
                isOpening ? 'translate-y-6 scale-95 rotate-1 opacity-0' : 'animate-float'
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.4rem] bg-cream">
                <Image src={weddingConfig.coverImage} alt="Ảnh thiệp cưới mở đầu" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/45 via-transparent to-white/10" />
                <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-white/85">
                  <span className="text-[10px] font-bold uppercase tracking-[0.36em]">Save the date</span>
                  <span className="rounded-full border border-white/50 px-4 py-2 font-display text-lg">{weddingConfig.monogram}</span>
                </div>
                <div className="absolute inset-x-7 bottom-7 rounded-[2rem] border border-white/55 bg-porcelain/82 p-7 text-center shadow-card backdrop-blur">
                  <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-dune">The Wedding of</p>
                  <h2 className="mt-3 font-display text-5xl leading-none text-plum">{weddingConfig.fullTitle}</h2>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-ink/58">{weddingConfig.displayDate}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            className="group mx-auto mt-9 flex min-w-64 items-center justify-center gap-3 rounded-full bg-plum px-9 py-4 text-sm font-bold uppercase tracking-[0.3em] text-white shadow-glow transition hover:-translate-y-1 hover:bg-wine disabled:cursor-wait disabled:opacity-70"
          >
            <span>{isOpening ? 'Đang mở...' : 'Mở thiệp'}</span>
            <span className="transition group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}
