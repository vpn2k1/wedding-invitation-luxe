import { SectionHeading } from '@/components/section-heading';
import { WeddingImage } from '@/components/wedding-image';
import { timeline } from '@/lib/wedding-data';

export function TimelineSection() {
  return (
    <section className="luxe-bg px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Love Story" title="Chuyện tình được viết bằng những mùa nhớ" />
        <div className="grid gap-6 md:grid-cols-2">
          {timeline.map((item, index) => (
            <article key={item.title} className="group grid overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/62 shadow-soft backdrop-blur md:grid-cols-[0.92fr_1.08fr]">
              <div className={`relative min-h-72 overflow-hidden bg-cream ${index % 2 ? 'md:order-2' : ''}`}>
                <WeddingImage src={item.image} alt={item.title} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full bg-plum/88 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-white/90">{item.date}</div>
              </div>
              <div className="flex flex-col justify-center p-7 md:p-8">
                <span className="font-display text-5xl text-dune">0{index + 1}</span>
                <h3 className="mt-2 font-display text-4xl leading-none text-plum">{item.title}</h3>
                <p className="mt-5 leading-8 text-ink/64">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
