'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SectionHeading } from '@/components/section-heading';
import { WeddingImage } from '@/components/wedding-image';
import { getFallbackAlbumImages } from '@/lib/supabase/mappers';
import type { AlbumImage } from '@/lib/supabase/types';

export function AlbumPreview() {
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const preview = images.slice(0, 5);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/album')
      .then((response) => response.json())
      .then((data: { images?: AlbumImage[] }) => {
        if (isMounted) setImages(data.images?.length ? data.images : getFallbackAlbumImages());
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
  }, []);

  return (
    <section className="relative overflow-hidden bg-porcelain px-5 py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dune/40 to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Photo Book"
          title="Album ảnh dạng storybook"
          description="Một vài khoảnh khắc nhẹ nhàng được đặt như những trang sách nhỏ."
        />

        <div className="grid auto-rows-[13rem] grid-cols-2 gap-4 md:auto-rows-[16rem] md:grid-cols-4">
          {isLoading && Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`animate-pulse rounded-[2rem] bg-cream shadow-soft ${index === 0 ? 'col-span-2 row-span-2' : ''} ${index === 3 ? 'md:row-span-2' : ''}`}
            />
          ))}
          {!isLoading && preview.map((image, index) => (
            <Link
              key={image.id}
              href={`/album?photo=${index + 1}`}
              className={`group relative overflow-hidden rounded-[2rem] bg-cream shadow-soft ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              } ${index === 3 ? 'md:row-span-2' : ''}`}
            >
              <WeddingImage src={image.imageUrl} alt={image.title || 'Ảnh album cưới'} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/66 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-champagne">Chapter {index + 1}</p>
                <h3 className="mt-1 font-display text-3xl leading-none">{image.title || 'Khoảnh khắc cưới'}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/album" className="inline-flex rounded-full bg-plum px-8 py-4 text-sm font-bold uppercase tracking-[0.28em] text-white shadow-card transition hover:-translate-y-1 hover:bg-wine">
            Xem toàn bộ album
          </Link>
        </div>
      </div>
    </section>
  );
}
