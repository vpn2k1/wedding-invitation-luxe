'use client';

import { useMusic } from '@/components/music-provider';
import { useSiteSettings } from '@/components/site-settings-provider';

export function MusicToggle() {
  const { isPlaying, toggleMusic } = useMusic();
  const { settings } = useSiteSettings();

  if (!settings.musicEnabled || !settings.musicUrl) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-white/70 bg-porcelain/90 px-4 py-3 text-sm font-bold text-plum shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
      aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
    >
      <span className={isPlaying ? 'animate-slowSpin' : ''}>♪</span>
      {isPlaying ? 'Đang phát' : 'Bật nhạc'}
    </button>
  );
}
