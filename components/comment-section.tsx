'use client';

import { FormEvent, useState } from 'react';
import { initialComments } from '@/lib/wedding-data';

type CommentItem = {
  name: string;
  message: string;
  time: string;
};

export function CommentSection() {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState('Có thể tham dự');
  const [guestCount, setGuestCount] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      setComments((current) => [
        {
          name: name.trim(),
          message: `${message.trim()} · ${attendance} · ${guestCount || '1'} khách`,
          time: 'Vừa xong',
        },
        ...current,
      ]);
      setName('');
      setMessage('');
      setAttendance('Có thể tham dự');
      setGuestCount('1');
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <section id="guestbook" className="relative overflow-hidden bg-porcelain px-5 py-24">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-wine/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.42em] text-dune">Guestbook & RSVP</p>
          <h2 className="font-display text-6xl leading-none text-plum md:text-7xl">Gửi lời chúc</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-ink/64">Hãy để lại một lời nhắn nhỏ để chúng mình lưu giữ trong ngày đặc biệt này.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-[2.6rem] border border-white/70 bg-white/68 p-5 shadow-card backdrop-blur md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/68" htmlFor="guest-name">Tên của bạn</label>
                <input
                  id="guest-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-cream bg-porcelain px-4 py-3 outline-none transition focus:border-dune"
                  placeholder="Ví dụ: Gia đình cô Lan"
                  maxLength={60}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink/68" htmlFor="guest-count">Số khách</label>
                <input
                  id="guest-count"
                  type="number"
                  min="1"
                  max="20"
                  value={guestCount}
                  onChange={(event) => setGuestCount(event.target.value)}
                  className="w-full rounded-2xl border border-cream bg-porcelain px-4 py-3 outline-none transition focus:border-dune"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink/68" htmlFor="guest-attendance">Trạng thái tham dự</label>
              <select
                id="guest-attendance"
                value={attendance}
                onChange={(event) => setAttendance(event.target.value)}
                className="w-full rounded-2xl border border-cream bg-porcelain px-4 py-3 outline-none transition focus:border-dune"
              >
                <option>Có thể tham dự</option>
                <option>Không thể tham dự</option>
                <option>Chưa chắc</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink/68" htmlFor="guest-message">Lời chúc</label>
              <textarea
                id="guest-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-32 w-full resize-none rounded-2xl border border-cream bg-porcelain px-4 py-3 outline-none transition focus:border-dune"
                placeholder="Chúc hai bạn..."
                maxLength={300}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="w-full rounded-full bg-plum px-6 py-4 text-sm font-bold uppercase tracking-[0.28em] text-white transition hover:bg-wine disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi lời chúc'}
            </button>
            <p className="text-xs leading-6 text-ink/50">Bản mẫu này đang lưu lời chúc tạm trên trình duyệt. Khi làm database, form sẽ chuyển sang API + database.</p>
          </form>
        </div>

        <div className="rounded-[2.6rem] border border-white/70 bg-white/62 p-5 shadow-card backdrop-blur md:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.36em] text-dune">Messages</p>
              <h3 className="mt-2 font-display text-5xl leading-none text-plum">Lời chúc mới nhất</h3>
            </div>
            <span className="rounded-full bg-porcelain px-4 py-2 text-sm font-semibold text-ink/50">{comments.length} lời chúc</span>
          </div>
          <div className="mt-6 space-y-4">
            {comments.map((comment, index) => (
              <article key={`${comment.name}-${index}`} className="rounded-[1.8rem] border border-cream bg-porcelain/75 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold text-plum">{comment.name}</h4>
                  <span className="text-xs text-ink/42">{comment.time}</span>
                </div>
                <p className="mt-3 leading-7 text-ink/64">{comment.message}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
