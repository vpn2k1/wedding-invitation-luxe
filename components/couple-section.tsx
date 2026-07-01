import Image from 'next/image';
import { SectionHeading } from '@/components/section-heading';
import { couple, weddingConfig } from '@/lib/wedding-data';

export function CoupleSection() {
  const people = [couple.bride, couple.groom];

  return (
    <section className="luxe-bg px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Bride & Groom"
          title="Hai trái tim, một lời hẹn"
          description="Chúng mình rất mong được gặp bạn trong ngày đặc biệt, nơi mọi lời chúc đều trở thành một phần kỷ niệm."
        />

        <div className="grid gap-7 md:grid-cols-2">
          {people.map((person, index) => (
            <article key={person.role} className="group relative overflow-hidden rounded-[2.6rem] border border-white/70 bg-white/62 p-4 shadow-card backdrop-blur">
              <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
                  <Image src={person.image} alt={`Ảnh ${person.role}`} fill className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center p-4 md:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-dune">{person.role}</p>
                  <h3 className="mt-4 font-display text-5xl leading-none text-plum">{person.name}</h3>
                  <div className="gold-line my-6" />
                  <p className="text-base leading-8 text-ink/66">{person.description}</p>
                  <p className="mt-8 font-display text-3xl italic text-clay">{index === 0 ? weddingConfig.brideName : weddingConfig.groomName}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
