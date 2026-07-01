'use client';

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { weddingConfig } from '@/lib/wedding-data';

type MusicContextValue = {
  isPlaying: boolean;
  startMusic: () => Promise<void>;
  toggleMusic: () => Promise<void>;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(weddingConfig.musicUrl);
    audio.loop = true;
    audio.volume = 0.32;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audioRef.current = null;
    };
  }, []);

  const startMusic = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      await startMusic();
      return;
    }
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return <MusicContext.Provider value={{ isPlaying, startMusic, toggleMusic }}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const value = useContext(MusicContext);
  if (!value) {
    throw new Error('useMusic must be used inside MusicProvider');
  }
  return value;
}
