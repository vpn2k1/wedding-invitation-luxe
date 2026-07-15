'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getFallbackComments } from '@/lib/supabase/mappers';
import type { AttendanceStatus, GuestComment } from '@/lib/supabase/types';

const attendanceOptions: { label: string; value: AttendanceStatus }[] = [
  { label: 'Có thể tham dự', value: 'attending' },
  { label: 'Không thể tham dự', value: 'not_attending' },
  { label: 'Chưa chắc', value: 'maybe' },
];

function formatCommentTime(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Vừa xong';
  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000));
  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return date.toLocaleDateString('vi-VN');
}

export function CommentSection() {
  const [comments, setComments] = useState<GuestComment[]>(getFallbackComments());
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('attending');
  const [guestCount, setGuestCount] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch('/api/comments')
      .then((response) => response.json())
      .then((data: { comments?: GuestComment[] }) => {
        if (isMounted && data.comments?.length) setComments(data.comments);
      })
      .catch(() => {
        if (isMounted) setComments(getFallbackComments());
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setNotice('');
    setError('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          message,
          attendanceStatus: attendance,
          guestCount: Number(guestCount || 1),
        }),
      });
      const data = (await response.json()) as { success: boolean; comment?: GuestComment; message?: string };

      if (!response.ok || !data.success || !data.comment) {
        throw new Error(data.message || 'Không thể gửi lời chúc lúc này.');
      }

      setComments((current) => [data.comment as GuestComment, ...current]);
      setName('');
      setMessage('');
      setAttendance('attending');
      setGuestCount('1');
      setNotice('Cảm ơn bạn, lời chúc đã được gửi.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể gửi lời chúc lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="relative overflow-hidden bg-porcelain px-5 py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-moss/35 to-transparent" />
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
                onChange={(event) => setAttendance(event.target.value as AttendanceStatus)}
                className="w-full rounded-2xl border border-cream bg-porcelain px-4 py-3 outline-none transition focus:border-dune"
              >
                {attendanceOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
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
            {notice && <p className="rounded-2xl bg-champagne px-4 py-3 text-sm font-semibold text-ink">{notice}</p>}
            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
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
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-[1.8rem] border border-cream bg-porcelain/75" />
            ))}
            {!isLoading && comments.map((comment) => (
              <article key={comment.id} className="rounded-[1.8rem] border border-cream bg-porcelain/75 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold text-plum">{comment.name}</h4>
                  <span className="text-xs text-ink/42">{formatCommentTime(comment.createdAt)}</span>
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
