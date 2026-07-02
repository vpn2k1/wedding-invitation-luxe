'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/components/site-settings-provider';

const navItems = [
  { label: 'Thiệp', href: '/invitation#top' },
  { label: 'Lịch trình', href: '/invitation#events' },
  { label: 'Album', href: '/album' },
  { label: 'Lời chúc', href: '/invitation#guestbook' },
];

export function SiteHeader() {
  const { settings } = useSiteSettings();
  const monogram = `${settings.brideName[0] || ''}&${settings.groomName[0] || ''}`;

  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-3 py-3 sm:px-4 sm:py-4">
      <nav className="glass-nav mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-3 shadow-soft sm:px-4 md:px-6">
        <Link href="/invitation" className="flex min-w-0 items-center gap-3 text-plum" aria-label="Về trang thiệp cưới">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-dune/40 bg-porcelain font-display text-sm shadow-sm">
            {monogram}
          </span>
          <span className="hidden truncate font-display text-2xl leading-none md:inline">{settings.fullTitle}</span>
        </Link>
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto text-[10px] font-bold uppercase tracking-[0.14em] text-ink/58 sm:gap-2 sm:text-xs sm:tracking-[0.2em] md:gap-5">
          {navItems.map((item) => (
            <Link key={item.href} className="shrink-0 rounded-full px-2 py-2 transition hover:bg-wine hover:text-white sm:px-3" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
