'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSiteSettings } from '@/components/site-settings-provider';
import { getFallbackAlbumImages } from '@/lib/supabase/mappers';
import type { AlbumImage } from '@/lib/supabase/types';

function clampIndex(value: number, length: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), Math.max(length - 1, 0));
}

export function AlbumStorybook() {
  const { settings } = useSiteSettings();
  const searchParams = useSearchParams();
  const [images, setImages] = useState<AlbumImage[]>(getFallbackAlbumImages());
  const [isLoading, setIsLoading] = useState(true);
  const initial = clampIndex(Number(searchParams.get('photo') || 1) - 1, images.length);
  const [activeIndex, setActiveIndex] = useState(initial);
  const activeImage = images[activeIndex];
  const nextImage = images[(activeIndex + 1) % images.length];

  useEffect(() => {
    let isMounted = true;

    fetch('/api/album')
      .then((response) => response.json())
      .then((data: { images?: AlbumImage[] }) => {
        if (isMounted && data.images?.length) {
          setImages(data.images);
          setActiveIndex(clampIndex(Number(searchParams.get('photo') || 1) - 1, data.images.length));
        }
      })
      .catch(() => {
        if (isMounted) setImages(getFallbackAlbumImages());
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const pageLabel = useMemo(() => `${activeIndex + 1} / ${images.length}`, [activeIndex, images.length]);

  const goPrev = () => setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  const goNext = () => setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));

  return (
    <main className="luxe-bg min-h-screen px-5 pb-20 pt-28 text-ink">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.45em] text-dune">Editorial Photo Book</p>
            <h1 className="font-display text-6xl leading-none text-plum md:text-8xl">Album cưới</h1>
            <p className="mt-4 max-w-2xl leading-8 text-ink/62">Ảnh được ưu tiên lấy từ Supabase Storage, tự fallback khi chưa cấu hình.</p>
          </div>
          <Link href="/invitation#album" className="rounded-full border border-dune/30 bg-white/70 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-plum shadow-sm transition hover:bg-plum hover:text-white">
            Về trang thiệp
          </Link>
        </div>

        <section className="album-book grid gap-7 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-5 rounded-[2.8rem] border border-white/70 bg-white/50 p-3 shadow-glow backdrop-blur md:grid-cols-2 md:p-5">
            <article className="album-page-left relative overflow-hidden rounded-[2.2rem] bg-cream shadow-soft">
              <div className="relative aspect-[4/5] md:aspect-[4/5]">
                {isLoading && <div className="absolute inset-0 animate-pulse bg-cream" />}
                {!isLoading && activeImage && <Image src={activeImage.imageUrl} alt={activeImage.title || 'Ảnh album cưới'} fill priority className="object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-plum/55 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-champagne">Page {pageLabel}</p>
                  <h2 className="mt-2 font-display text-5xl leading-none">{activeImage?.title || 'Khoảnh khắc cưới'}</h2>
                  <p className="mt-3 leading-7 text-white/78">{activeImage?.description || 'Một khoảnh khắc đáng nhớ trong album.'}</p>
                </div>
              </div>
            </article>

            <article className="album-page-right hidden overflow-hidden rounded-[2.2rem] border border-cream bg-porcelain p-6 shadow-soft md:block">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-dune">Next Chapter</p>
                  <h3 className="mt-4 font-display text-5xl leading-none text-plum">{nextImage?.title || 'Khoảnh khắc tiếp theo'}</h3>
                  <p className="mt-5 leading-8 text-ink/62">{nextImage?.description || 'Một trang ảnh khác trong câu chuyện cưới.'}</p>
                </div>
                <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-[1.8rem] bg-cream">
                  {nextImage && <Image src={nextImage.imageUrl} alt={nextImage.title || 'Ảnh album cưới'} fill className="object-cover" />}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-dune/20 pt-5 text-sm text-ink/50">
                  <span>{settings.fullTitle}</span>
                  <span>{settings.displayDate}</span>
                </div>
              </div>
            </article>
          </div>

          <aside className="rounded-[2.4rem] border border-white/70 bg-white/62 p-5 shadow-card backdrop-blur">
            <div className="flex gap-3">
              <button type="button" onClick={goPrev} className="flex-1 rounded-full border border-dune/30 px-5 py-3 font-bold text-plum transition hover:bg-plum hover:text-white">
                Trước
              </button>
              <button type="button" onClick={goNext} className="flex-1 rounded-full bg-plum px-5 py-3 font-bold text-white transition hover:bg-wine">
                Sau
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                    index === activeIndex ? 'border-plum ring-2 ring-plum/20' : 'border-cream opacity-65 hover:opacity-100'
                  }`}
                  aria-label={`Xem ảnh ${image.title}`}
                >
                  <Image src={image.imageUrl} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[1.6rem] bg-porcelain p-4 text-sm leading-7 text-ink/60">
              <p className="font-bold text-plum">Ghi chú mở rộng</p>
              <p className="mt-2">Admin upload ảnh vào Supabase, album sẽ tự cập nhật từ endpoint <code>/api/album</code>.</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
