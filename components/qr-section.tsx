import Image from 'next/image';
import { SectionHeading } from '@/components/section-heading';
import { bankQrList } from '@/lib/wedding-data';

export function QrSection() {
  return (
    <section className="luxe-bg px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Wedding Gift"
          title="QR mừng cưới"
          description="Sự hiện diện của bạn là món quà quý giá nhất. Nếu muốn gửi lời chúc qua chuyển khoản, bạn có thể dùng QR bên dưới."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {bankQrList.map((bank) => (
            <article key={bank.accountNumber} className="relative overflow-hidden rounded-[2.6rem] border border-white/70 bg-white/64 p-6 text-center shadow-card backdrop-blur">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-champagne/20 blur-2xl" />
              <div className="relative mx-auto grid h-64 w-64 place-items-center rounded-[2rem] border border-dune/20 bg-porcelain p-5 shadow-soft">
                <Image src={bank.qrImage} alt={`QR ${bank.ownerName}`} fill className="object-contain p-6" />
              </div>
              <h3 className="mt-7 font-display text-4xl leading-none text-plum">{bank.ownerName}</h3>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.24em] text-dune">{bank.bankName}</p>
              <p className="mt-2 text-lg font-semibold text-ink/75">STK: {bank.accountNumber}</p>
              <p className="mt-5 rounded-[1.5rem] bg-porcelain px-4 py-3 text-sm text-ink/60">Nội dung: {bank.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
