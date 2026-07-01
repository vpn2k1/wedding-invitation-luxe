import { weddingConfig } from '@/lib/wedding-data';

export function SiteFooter() {
  return (
    <footer className="deep-bg px-5 py-16 text-center text-white">
      <p className="text-[11px] font-bold uppercase tracking-[0.45em] text-champagne/75">Thank you for celebrating with us</p>
      <h2 className="mt-5 font-display text-6xl leading-none md:text-8xl">{weddingConfig.fullTitle}</h2>
      <p className="mt-5 text-white/68">{weddingConfig.displayDate}</p>
      <div className="gold-line mx-auto mt-8 max-w-md opacity-60" />
    </footer>
  );
}
