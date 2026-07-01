import Link from 'next/link';
import { weddingConfig } from '@/lib/wedding-data';

const navItems = [
  { label: 'Thiệp', href: '/invitation#top' },
  { label: 'Lịch trình', href: '/invitation#events' },
  { label: 'Album', href: '/album' },
  { label: 'Lời chúc', href: '/invitation#guestbook' },
];

export function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 py-4">
      <nav className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-3 shadow-soft md:px-6">
        <Link href="/invitation" className="flex items-center gap-3 text-plum" aria-label="Về trang thiệp cưới">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-dune/40 bg-porcelain font-display text-sm shadow-sm">
            {weddingConfig.monogram}
          </span>
          <span className="hidden font-display text-2xl leading-none md:inline">{weddingConfig.fullTitle}</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink/58 md:gap-5">
          {navItems.map((item) => (
            <Link key={item.href} className="rounded-full px-3 py-2 transition hover:bg-wine hover:text-white" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
