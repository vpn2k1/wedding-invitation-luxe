'use client';

import { CountdownTimer } from '@/components/countdown-timer';
import { useSiteSettings } from '@/components/site-settings-provider';
import { WeddingImage } from '@/components/wedding-image';

export function HeroSection() {
  const { settings, isLoading } = useSiteSettings();

  return (
    <section id="top" className="deep-bg relative min-h-screen overflow-hidden px-5 pb-20 pt-32 text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-wine/35 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="animate-fadeUp">
          <p className="text-[11px] font-bold uppercase tracking-[0.52em] text-wine">Lễ thành hôn</p>
          <h1 className="mt-5 font-display text-7xl leading-[0.86] text-plum md:text-9xl lg:text-[9.6rem]">
            {settings.brideName}
            <span className="block text-5xl italic text-wine md:text-7xl">&</span>
            {settings.groomName}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-9 text-ink/68">{settings.quote}</p>
          <div className="mt-10 max-w-2xl">
            <CountdownTimer />
          </div>
        </div>

        <div className="relative animate-fadeUp lg:pl-8" style={{ animationDelay: '120ms' }}>
          <div className="absolute -left-8 top-8 hidden h-[80%] w-20 rounded-full border border-wine/15 lg:block" />
          <div className="relative overflow-hidden rounded-[3rem] border border-cream bg-white p-3 shadow-glow">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.4rem] bg-cream lg:aspect-[5/6]">
              <WeddingImage src={isLoading ? null : settings.heroImage} fallbackSrc="/images/luxe-hero.svg" alt="Ảnh cưới cô dâu chú rể" fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/52 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 rounded-[1.4rem] border border-white/18 bg-ink/18 p-5 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rose-200">{settings.displayDate}</p>
                <p className="mt-3 font-display text-4xl leading-none">Trân trọng kính mời</p>
                <p className="mt-3 leading-7 text-white/74">Bạn đến chung vui cùng gia đình chúng mình trong ngày lễ thành hôn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
