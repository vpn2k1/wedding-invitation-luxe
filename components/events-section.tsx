import { SectionHeading } from '@/components/section-heading';
import { dressCodes, events } from '@/lib/wedding-data';

export function EventsSection() {
  return (
    <section id="events" className="relative overflow-hidden bg-porcelain px-5 py-24">
      <div className="absolute -left-24 top-28 h-80 w-80 rounded-full bg-champagne/20 blur-3xl" />
      <div className="absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-wine/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Wedding Day"
          title="Lịch trình ngày cưới"
          description="Thông tin các buổi lễ chính. Bạn có thể mở bản đồ để xem đường đi nhanh hơn."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {events.map((event, index) => (
            <article key={event.title} className="group rounded-[2.4rem] border border-cream bg-white/76 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="flex items-start justify-between gap-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-plum font-display text-2xl text-white shadow-soft">0{index + 1}</span>
                <span className="rounded-full border border-dune/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-dune">{event.accent}</span>
              </div>
              <h3 className="mt-7 font-display text-4xl leading-none text-plum">{event.title}</h3>
              <div className="gold-line my-5" />
              <dl className="space-y-4 text-sm leading-7 text-ink/66">
                <div>
                  <dt className="font-bold uppercase tracking-[0.22em] text-ink/42">Thời gian</dt>
                  <dd className="mt-1 text-lg font-semibold text-ink">{event.time} · {event.date}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-[0.22em] text-ink/42">Địa điểm</dt>
                  <dd className="mt-1 font-semibold text-ink">{event.locationName}</dd>
                  <dd>{event.address}</dd>
                </div>
              </dl>
              <p className="mt-5 leading-8 text-ink/62">{event.description}</p>
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex rounded-full bg-plum px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-wine"
              >
                Mở Google Maps
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[2.4rem] border border-cream bg-white/70 p-6 shadow-soft md:p-8">
          <div className="grid gap-8 md:grid-cols-[0.78fr_1.22fr] md:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-dune">Dress Code</p>
              <h3 className="mt-3 font-display text-4xl text-plum md:text-5xl">Gợi ý trang phục</h3>
              <p className="mt-4 leading-8 text-ink/62">Nếu tiện, bạn có thể chọn các tông màu dưới đây để hình ảnh ngày cưới hài hòa hơn.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {dressCodes.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-cream bg-porcelain p-4 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full border border-white shadow-soft" style={{ backgroundColor: item.color }} />
                  <p className="mt-3 font-display text-2xl text-plum">{item.label}</p>
                  <p className="text-xs text-ink/50">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
