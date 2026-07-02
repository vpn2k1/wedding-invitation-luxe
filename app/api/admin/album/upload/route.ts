import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getFallbackSiteSettings, mapAlbumImage } from '@/lib/supabase/mappers';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { AlbumImageRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const metadataSchema = z.object({
  siteId: z.string().uuid(),
  title: z.string().trim().max(160).optional(),
  description: z.string().trim().max(500).optional(),
});

function logUpload(requestId: string, step: string, details?: Record<string, unknown>) {
  console.info(`[admin-album-upload:${requestId}] ${step}`, details || {});
}

function logUploadError(requestId: string, step: string, error: unknown, details?: Record<string, unknown>) {
  console.error(`[admin-album-upload:${requestId}] ${step}`, {
    ...details,
    error,
  });
}

function getSafeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getSupabaseSetupMessage(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('schema cache') || lowerMessage.includes('could not find the table') || lowerMessage.includes('relation') && lowerMessage.includes('does not exist')) {
    return `${message}. Supabase chưa có đủ database schema. Hãy mở Supabase SQL Editor và chạy file supabase/schema.sql, sau đó chạy supabase/seed.sql.`;
  }

  return message;
}

type SupabaseAdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

async function ensureStorageBucket(supabase: SupabaseAdminClient) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    return getSupabaseSetupMessage(listError.message);
  }

  const exists = buckets?.some((bucket) => bucket.name === 'wedding-images');

  if (exists) {
    return null;
  }

  const { error } = await supabase.storage.createBucket('wedding-images', {
    public: true,
  });

  if (error && !error.message.toLowerCase().includes('already exists')) {
    return getSupabaseSetupMessage(error.message);
  }

  return null;
}

async function ensureWeddingSite(supabase: SupabaseAdminClient, siteId: string) {
  const fallback = getFallbackSiteSettings();
  const { error } = await supabase
    .from('wedding_sites')
    .upsert(
      {
        id: siteId,
        slug: fallback.slug,
        bride_name: fallback.brideName,
        groom_name: fallback.groomName,
        wedding_date: fallback.weddingDate,
        is_active: true,
      },
      { onConflict: 'id' }
    );

  return error?.message ? getSupabaseSetupMessage(error.message) : null;
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  logUpload(requestId, 'request:start');

  try {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      logUploadError(requestId, 'config:missing-admin-client', 'Supabase admin client is null', {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      });
      return NextResponse.json({ success: false, message: 'Supabase admin client chưa được cấu hình.' }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const parsed = metadataSchema.safeParse({
      siteId: formData.get('siteId') || process.env.NEXT_PUBLIC_SITE_ID,
      title: formData.get('title') || undefined,
      description: formData.get('description') || undefined,
    });

    if (!parsed.success) {
      logUploadError(requestId, 'metadata:invalid', parsed.error.flatten(), {
        envSiteId: process.env.NEXT_PUBLIC_SITE_ID,
      });
      return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message || 'Metadata không hợp lệ.' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      logUploadError(requestId, 'file:missing', 'file field is missing');
      return NextResponse.json({ success: false, message: 'Thiếu file ảnh.' }, { status: 400 });
    }

    logUpload(requestId, 'file:received', {
      siteId: parsed.data.siteId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      title: parsed.data.title,
    });

    if (!ALLOWED_TYPES.includes(file.type)) {
      logUploadError(requestId, 'file:unsupported-type', file.type, { allowedTypes: ALLOWED_TYPES });
      return NextResponse.json({ success: false, message: 'Chỉ hỗ trợ JPEG, PNG hoặc WebP.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      logUploadError(requestId, 'file:too-large', file.size, { maxFileSize: MAX_FILE_SIZE });
      return NextResponse.json({ success: false, message: 'File ảnh tối đa 5MB.' }, { status: 400 });
    }

    logUpload(requestId, 'bucket:ensure:start');
    const bucketError = await ensureStorageBucket(supabase);

    if (bucketError) {
      logUploadError(requestId, 'bucket:ensure:failed', bucketError);
      return NextResponse.json({ success: false, message: `Không thể chuẩn bị bucket wedding-images: ${bucketError}` }, { status: 500 });
    }

    logUpload(requestId, 'site:ensure:start', { siteId: parsed.data.siteId });
    const siteError = await ensureWeddingSite(supabase, parsed.data.siteId);

    if (siteError) {
      logUploadError(requestId, 'site:ensure:failed', siteError, { siteId: parsed.data.siteId });
      return NextResponse.json({ success: false, message: `Không thể chuẩn bị wedding site: ${siteError}` }, { status: 500 });
    }

    const safeFileName = getSafeFileName(file.name) || 'album-image';
    const storagePath = `${parsed.data.siteId}/album/${Date.now()}-${safeFileName}`;
    logUpload(requestId, 'storage:upload:start', { storagePath });
    const { error: uploadError } = await supabase.storage.from('wedding-images').upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      logUploadError(requestId, 'storage:upload:failed', uploadError, { storagePath });
      return NextResponse.json({ success: false, message: getSupabaseSetupMessage(uploadError.message) }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from('wedding-images').getPublicUrl(storagePath);
    logUpload(requestId, 'database:insert:start', {
      siteId: parsed.data.siteId,
      storagePath,
      publicUrl: publicUrlData.publicUrl,
    });
    const { data, error } = await supabase
      .from('album_images')
      .insert({
        site_id: parsed.data.siteId,
        title: parsed.data.title || null,
        description: parsed.data.description || null,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        is_visible: true,
      })
      .select('*')
      .single();

    if (error || !data) {
      logUploadError(requestId, 'database:insert:failed', error || 'missing inserted row', { storagePath });
      await supabase.storage.from('wedding-images').remove([storagePath]);
      return NextResponse.json({ success: false, message: error?.message ? getSupabaseSetupMessage(error.message) : 'Không thể lưu metadata ảnh.' }, { status: 500 });
    }

    logUpload(requestId, 'request:success', {
      imageId: (data as AlbumImageRow).id,
      storagePath,
    });

    return NextResponse.json({ success: true, image: mapAlbumImage(data as AlbumImageRow) }, { status: 201 });
  } catch (error) {
    logUploadError(requestId, 'request:unexpected-error', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Lỗi upload ảnh không xác định.' }, { status: 500 });
  }
}
