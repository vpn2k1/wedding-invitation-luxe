'use client';

import Image from 'next/image';
import { CountdownTimer } from '@/components/countdown-timer';
import { useSiteSettings } from '@/components/site-settings-provider';

export function HeroSection() {
  const { settings } = useSiteSettings();

  return (
    <section id="top" className="deep-bg relative min-h-screen overflow-hidden px-5 pb-20 pt-32 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-8 top-28 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-clay/25 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="animate-fadeUp">
          <p className="text-[11px] font-bold uppercase tracking-[0.52em] text-champagne">The Wedding Celebration</p>
          <h1 className="mt-5 font-display text-7xl leading-[0.86] md:text-9xl lg:text-[9.6rem]">
            {settings.brideName}
            <span className="block text-5xl italic text-champagne md:text-7xl">&</span>
            {settings.groomName}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-9 text-white/72">{settings.quote}</p>
          <div className="mt-10 max-w-2xl">
            <CountdownTimer />
          </div>
        </div>

        <div className="relative animate-fadeUp lg:pl-8" style={{ animationDelay: '120ms' }}>
          <div className="absolute -left-8 top-8 hidden h-[80%] w-20 rounded-full border border-champagne/25 lg:block" />
          <div className="relative overflow-hidden rounded-[3rem] border border-white/15 bg-white/10 p-3 shadow-glow backdrop-blur">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.4rem] bg-plum lg:aspect-[5/6]">
              <Image src={settings.heroImage} alt="Ảnh cưới cô dâu chú rể" fill priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-plum/62 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 rounded-[1.8rem] border border-white/20 bg-white/12 p-6 backdrop-blur-md">
                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-champagne">{settings.displayDate}</p>
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
