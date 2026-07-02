'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { getFallbackSiteSettings } from '@/lib/supabase/mappers';
import type { AlbumImage, WeddingSiteSettings } from '@/lib/supabase/types';

type UploadResponse = {
  success: boolean;
  message?: string;
  image?: AlbumImage;
};

type SettingsResponse = {
  success?: boolean;
  message?: string;
  settings?: WeddingSiteSettings;
};

type MutationResponse = {
  success: boolean;
  message?: string;
  warning?: string;
};

export function AdminDashboard() {
  const router = useRouter();
  const uploadFormRef = useRef<HTMLFormElement | null>(null);
  const [settings, setSettings] = useState<WeddingSiteSettings>(getFallbackSiteSettings());
  const [activePanel, setActivePanel] = useState<'content' | 'events' | 'layout' | 'album'>('content');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingAlbum, setIsUpdatingAlbum] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const canUpload = useMemo(() => Boolean(file), [file]);

  const loadSettings = async () => {
    const response = await fetch('/api/admin/site/settings');
    const data = (await response.json()) as SettingsResponse;
    if (data.settings) setSettings(data.settings);
  };

  const loadImages = async () => {
    setIsLoadingImages(true);
    try {
      const response = await fetch('/api/album');
      const data = (await response.json()) as { images?: AlbumImage[] };
      setImages(data.images || []);
    } catch {
      setImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    loadSettings().catch(() => undefined);
    loadImages();
  }, []);

  const saveSettings = async () => {
    setIsSavingSettings(true);
    setNotice('');
    setError('');

    try {
      const response = await fetch('/api/admin/site/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = (await response.json()) as SettingsResponse;

      if (!response.ok || data.success === false || !data.settings) {
        throw new Error(data.message || 'Không thể lưu cấu hình.');
      }

      setSettings(data.settings);
      setNotice('Đã lưu cấu hình thiệp.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu cấu hình.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canUpload || !file) return;

    setIsUploading(true);
    setNotice('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim());
    formData.append('description', description.trim());

    try {
      const response = await fetch('/api/admin/album/upload', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json()) as UploadResponse;

      if (!response.ok || !data.success || !data.image) {
        throw new Error(data.message || 'Không thể upload ảnh lúc này.');
      }

      setImages((current) => [data.image as AlbumImage, ...current]);
      setTitle('');
      setDescription('');
      setFile(null);
      uploadFormRef.current?.reset();
      setNotice('Ảnh đã được upload và lưu vào album.');
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Không thể upload ảnh lúc này.');
    } finally {
      setIsUploading(false);
    }
  };

  const persistImageOrder = async (nextImages: AlbumImage[]) => {
    setIsUpdatingAlbum(true);
    setNotice('');
    setError('');

    try {
      const response = await fetch('/api/admin/album/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: nextImages.map((image) => image.id) }),
      });
      const data = (await response.json()) as MutationResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Không thể lưu thứ tự ảnh.');
      }

      setImages(nextImages.map((image, index) => ({ ...image, sortOrder: index + 1 })));
      setNotice('Đã cập nhật thứ tự album.');
    } catch (orderError) {
      setError(orderError instanceof Error ? orderError.message : 'Không thể lưu thứ tự ảnh.');
      await loadImages();
    } finally {
      setIsUpdatingAlbum(false);
    }
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length || isUpdatingAlbum) return;

    const nextImages = [...images];
    const [movedImage] = nextImages.splice(index, 1);
    nextImages.splice(targetIndex, 0, movedImage);
    setImages(nextImages);
    await persistImageOrder(nextImages);
  };

  const deleteImage = async (image: AlbumImage) => {
    if (isUpdatingAlbum) return;
    const shouldDelete = window.confirm(`Xóa ảnh "${image.title || 'Chưa có tiêu đề'}" khỏi album?`);
    if (!shouldDelete) return;

    setIsUpdatingAlbum(true);
    setNotice('');
    setError('');

    try {
      const response = await fetch(`/api/admin/album/${image.id}`, { method: 'DELETE' });
      const data = (await response.json()) as MutationResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Không thể xóa ảnh.');
      }

      setImages((current) => current.filter((item) => item.id !== image.id));
      setNotice(data.warning ? `Đã xóa ảnh khỏi database. Cảnh báo Storage: ${data.warning}` : 'Đã xóa ảnh khỏi album.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Không thể xóa ảnh.');
    } finally {
      setIsUpdatingAlbum(false);
    }
  };

  const updateSetting = (key: keyof WeddingSiteSettings, value: WeddingSiteSettings[keyof WeddingSiteSettings]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const updateEvent = (index: number, key: keyof WeddingSiteSettings['events'][number], value: string) => {
    setSettings((current) => ({
      ...current,
      events: current.events.map((event, eventIndex) => (eventIndex === index ? { ...event, [key]: value } : event)),
    }));
  };

  const addEvent = () => {
    setSettings((current) => ({
      ...current,
      events: [
        ...current.events,
        {
          title: 'Sự kiện mới',
          date: current.displayDate,
          time: '18:00',
          locationName: '',
          address: '',
          mapUrl: '',
          description: '',
        },
      ],
    }));
  };

  const removeEvent = (index: number) => {
    setSettings((current) => ({
      ...current,
      events: current.events.filter((_, eventIndex) => eventIndex !== index),
    }));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen luxe-bg px-5 py-10 text-ink">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-dune">Admin</p>
            <h1 className="font-serif text-4xl text-plum md:text-5xl">Quản lý thiệp cưới</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-wine/20 bg-white/80 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-plum transition hover:bg-wine hover:text-white"
            >
              Đăng xuất
            </button>
            <button
              type="button"
              onClick={saveSettings}
              disabled={isSavingSettings}
              className="rounded-full bg-wine px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-card transition hover:bg-[#5e3030] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingSettings ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {(notice || error) && (
          <div className="mb-5">
            {notice && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}
            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-card backdrop-blur">
            {[
              ['content', 'Thông tin'],
              ['events', 'Địa chỉ & sự kiện'],
              ['layout', 'Bố cục'],
              ['album', 'Album ảnh'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActivePanel(value as typeof activePanel)}
                className={`mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  activePanel === value ? 'bg-wine text-white' : 'bg-ivory text-ink/70 hover:bg-champagne'
                }`}
              >
                {label}
              </button>
            ))}
          </aside>

          <section className="rounded-[1.5rem] border border-white/80 bg-white/75 p-5 shadow-card backdrop-blur">
            {activePanel === 'content' && (
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Tên cô dâu" value={settings.brideName} onChange={(value) => updateSetting('brideName', value)} />
                <TextField label="Tên chú rể" value={settings.groomName} onChange={(value) => updateSetting('groomName', value)} />
                <TextField label="Tiêu đề" value={settings.fullTitle} onChange={(value) => updateSetting('fullTitle', value)} />
                <TextField label="Ngày cưới ISO" value={settings.weddingDate} onChange={(value) => updateSetting('weddingDate', value)} />
                <TextField label="Ngày hiển thị" value={settings.displayDate} onChange={(value) => updateSetting('displayDate', value)} />
                <TextField label="Slug" value={settings.slug} onChange={(value) => updateSetting('slug', value)} />
                <TextArea label="Quote" value={settings.quote} onChange={(value) => updateSetting('quote', value)} />
                <TextArea label="Mô tả cô dâu" value={settings.brideDescription} onChange={(value) => updateSetting('brideDescription', value)} />
                <TextArea label="Mô tả chú rể" value={settings.groomDescription} onChange={(value) => updateSetting('groomDescription', value)} />
                <TextField label="Ảnh bìa" value={settings.coverImage} onChange={(value) => updateSetting('coverImage', value)} />
                <TextField label="Ảnh hero" value={settings.heroImage} onChange={(value) => updateSetting('heroImage', value)} />
                <TextField label="Ảnh cô dâu" value={settings.brideImage} onChange={(value) => updateSetting('brideImage', value)} />
                <TextField label="Ảnh chú rể" value={settings.groomImage} onChange={(value) => updateSetting('groomImage', value)} />
                <TextField label="Nhạc nền" value={settings.musicUrl} onChange={(value) => updateSetting('musicUrl', value)} />
              </div>
            )}

            {activePanel === 'events' && (
              <div className="space-y-5">
                {settings.events.map((event, index) => (
                  <div key={`${event.title}-${index}`} className="rounded-2xl border border-champagne bg-ivory/70 p-4">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h2 className="font-serif text-2xl text-plum">Sự kiện {index + 1}</h2>
                      {settings.events.length > 1 && (
                        <button type="button" onClick={() => removeEvent(index)} className="rounded-full border border-wine/20 px-4 py-2 text-sm font-bold text-plum">
                          Xóa
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField label="Tên sự kiện" value={event.title} onChange={(value) => updateEvent(index, 'title', value)} />
                      <TextField label="Ngày" value={event.date} onChange={(value) => updateEvent(index, 'date', value)} />
                      <TextField label="Giờ" value={event.time} onChange={(value) => updateEvent(index, 'time', value)} />
                      <TextField label="Địa điểm" value={event.locationName} onChange={(value) => updateEvent(index, 'locationName', value)} />
                      <TextField label="Địa chỉ" value={event.address} onChange={(value) => updateEvent(index, 'address', value)} />
                      <TextField label="Google Maps URL" value={event.mapUrl} onChange={(value) => updateEvent(index, 'mapUrl', value)} />
                      <TextArea label="Mô tả" value={event.description} onChange={(value) => updateEvent(index, 'description', value)} />
                    </div>
                  </div>
                ))}
                {settings.events.length < 6 && (
                  <button type="button" onClick={addEvent} className="rounded-full bg-wine px-5 py-3 text-sm font-bold text-white">
                    Thêm sự kiện
                  </button>
                )}
              </div>
            )}

            {activePanel === 'layout' && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-ink/70">Số cột sự kiện</span>
                  <select
                    value={settings.layout.eventColumns}
                    onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, eventColumns: event.target.value as '2' | '3' } }))}
                    className="w-full rounded-2xl border border-champagne bg-white px-4 py-3 outline-none transition focus:border-dune"
                  >
                    <option value="2">2 cột</option>
                    <option value="3">3 cột</option>
                  </select>
                </label>
                {[
                  ['showTimeline', 'Hiển thị timeline'],
                  ['showAlbum', 'Hiển thị album'],
                  ['showQr', 'Hiển thị QR mừng cưới'],
                  ['showComments', 'Hiển thị lời chúc'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between rounded-2xl border border-champagne bg-ivory/70 px-4 py-3 font-semibold text-ink/70">
                    {label}
                    <input
                      type="checkbox"
                      checked={Boolean(settings.layout[key as keyof WeddingSiteSettings['layout']])}
                      onChange={(event) => setSettings((current) => ({ ...current, layout: { ...current.layout, [key]: event.target.checked } }))}
                      className="h-5 w-5 accent-wine"
                    />
                  </label>
                ))}
              </div>
            )}

            {activePanel === 'album' && (
              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <form ref={uploadFormRef} onSubmit={handleUpload} className="space-y-4 rounded-2xl border border-champagne bg-ivory/70 p-4">
                  <TextField label="Tiêu đề ảnh" value={title} onChange={setTitle} />
                  <TextArea label="Mô tả ảnh" value={description} onChange={setDescription} />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-ink/70" htmlFor="album-file">Ảnh album</label>
                    <input
                      id="album-file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => setFile(event.target.files?.[0] || null)}
                      className="w-full rounded-2xl border border-dashed border-dune/60 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-wine file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
                    />
                    <p className="mt-2 text-xs text-ink/50">Hỗ trợ JPEG, PNG, WebP. Tối đa 5MB.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={!canUpload || isUploading}
                    className="w-full rounded-full bg-wine px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#5e3030] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploading ? 'Đang upload...' : 'Upload ảnh'}
                  </button>
                </form>

                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="font-serif text-3xl text-plum">Ảnh đang hiển thị</h2>
                    <button type="button" onClick={loadImages} className="rounded-full border border-wine/20 bg-white/80 px-5 py-3 text-sm font-bold text-plum">
                      Tải lại
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {isLoadingImages && Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="aspect-square animate-pulse rounded-2xl bg-champagne/70" />
                    ))}

                    {!isLoadingImages && images.map((image, index) => (
                      <article key={image.id} className="overflow-hidden rounded-2xl border border-champagne bg-ivory/70">
                        <div className="relative aspect-square bg-champagne">
                          <Image src={image.imageUrl} alt={image.title || 'Ảnh album cưới'} fill className="object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="line-clamp-1 font-semibold text-plum">{image.title || 'Chưa có tiêu đề'}</h3>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/60">{image.description || 'Chưa có mô tả.'}</p>
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => moveImage(index, -1)}
                              disabled={index === 0 || isUpdatingAlbum}
                              className="rounded-full border border-wine/20 px-3 py-2 text-xs font-bold text-plum transition hover:bg-wine hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Lên
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(index, 1)}
                              disabled={index === images.length - 1 || isUpdatingAlbum}
                              className="rounded-full border border-wine/20 px-3 py-2 text-xs font-bold text-plum transition hover:bg-wine hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Xuống
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteImage(image)}
                              disabled={isUpdatingAlbum}
                              className="rounded-full bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink/70">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-champagne bg-white px-4 py-3 outline-none transition focus:border-dune"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-semibold text-ink/70">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full resize-none rounded-2xl border border-champagne bg-white px-4 py-3 outline-none transition focus:border-dune"
      />
    </label>
  );
}
