'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSiteSettings } from '@/components/site-settings-provider';

function getTimeLeft(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function CountdownTimer() {
  const { settings } = useSiteSettings();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(settings.weddingDate));

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(settings.weddingDate)), 1000);
    return () => window.clearInterval(timer);
  }, [settings.weddingDate]);

  const items = useMemo(
    () => [
      { label: 'Ngày', value: timeLeft.days },
      { label: 'Giờ', value: timeLeft.hours },
      { label: 'Phút', value: timeLeft.minutes },
      { label: 'Giây', value: timeLeft.seconds },
    ],
    [timeLeft]
  );

  return (
    <div className="grid grid-cols-4 gap-2 rounded-[2rem] border border-white/70 bg-white/58 p-2 shadow-soft backdrop-blur md:gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1.35rem] bg-porcelain/80 px-3 py-4 text-center">
          <div className="font-display text-3xl leading-none text-plum md:text-5xl">{String(item.value).padStart(2, '0')}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-ink/45">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
