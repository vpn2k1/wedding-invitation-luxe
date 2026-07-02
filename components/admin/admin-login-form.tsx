'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Không thể đăng nhập.');
      }

      router.replace(nextPath.startsWith('/') ? nextPath : '/admin');
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Không thể đăng nhập.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen luxe-bg px-5 py-10 text-ink">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full rounded-[1.5rem] border border-white/80 bg-white/75 p-6 shadow-card backdrop-blur">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-dune">Admin</p>
          <h1 className="font-serif text-4xl text-plum">Đăng nhập</h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Tài khoản được cấu hình bằng `ADMIN_USERNAME` và `ADMIN_PASSWORD` trong `.env.local`.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink/70">User name</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-champagne bg-white px-4 py-3 outline-none transition focus:border-dune"
                autoComplete="username"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink/70">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-champagne bg-white px-4 py-3 outline-none transition focus:border-dune"
                autoComplete="current-password"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !username.trim() || !password}
              className="w-full rounded-full bg-wine px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#5e3030] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
