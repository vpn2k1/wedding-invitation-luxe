import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getFallbackSiteSettings } from '@/lib/supabase/mappers';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const BUCKET_NAME = 'wedding-images';
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];

const metadataSchema = z.object({
  siteId: z.string().uuid(),
});

function logMusicUpload(requestId: string, step: string, details?: Record<string, unknown>) {
  console.info(`[admin-music-upload:${requestId}] ${step}`, details || {});
}

function logMusicUploadError(requestId: string, step: string, error: unknown, details?: Record<string, unknown>) {
  console.error(`[admin-music-upload:${requestId}] ${step}`, {
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

  const exists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);

  if (exists) {
    return null;
  }

  const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
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
  logMusicUpload(requestId, 'request:start');

  try {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      logMusicUploadError(requestId, 'config:missing-admin-client', 'Supabase admin client is null', {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      });
      return NextResponse.json({ success: false, message: 'Supabase admin client chưa được cấu hình.' }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const parsed = metadataSchema.safeParse({
      siteId: formData.get('siteId') || process.env.NEXT_PUBLIC_SITE_ID,
    });

    if (!parsed.success) {
      logMusicUploadError(requestId, 'metadata:invalid', parsed.error.flatten(), {
        envSiteId: process.env.NEXT_PUBLIC_SITE_ID,
      });
      return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message || 'Metadata không hợp lệ.' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      logMusicUploadError(requestId, 'file:missing', 'file field is missing');
      return NextResponse.json({ success: false, message: 'Thiếu file nhạc.' }, { status: 400 });
    }

    logMusicUpload(requestId, 'file:received', {
      siteId: parsed.data.siteId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    if (!ALLOWED_TYPES.includes(file.type)) {
      logMusicUploadError(requestId, 'file:unsupported-type', file.type, { allowedTypes: ALLOWED_TYPES });
      return NextResponse.json({ success: false, message: 'Chỉ hỗ trợ MP3, WAV, OGG hoặc M4A.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      logMusicUploadError(requestId, 'file:too-large', file.size, { maxFileSize: MAX_FILE_SIZE });
      return NextResponse.json({ success: false, message: 'File nhạc tối đa 15MB.' }, { status: 400 });
    }

    logMusicUpload(requestId, 'bucket:ensure:start');
    const bucketError = await ensureStorageBucket(supabase);

    if (bucketError) {
      logMusicUploadError(requestId, 'bucket:ensure:failed', bucketError);
      return NextResponse.json({ success: false, message: `Không thể chuẩn bị bucket ${BUCKET_NAME}: ${bucketError}` }, { status: 500 });
    }

    logMusicUpload(requestId, 'site:ensure:start', { siteId: parsed.data.siteId });
    const siteError = await ensureWeddingSite(supabase, parsed.data.siteId);

    if (siteError) {
      logMusicUploadError(requestId, 'site:ensure:failed', siteError, { siteId: parsed.data.siteId });
      return NextResponse.json({ success: false, message: `Không thể chuẩn bị wedding site: ${siteError}` }, { status: 500 });
    }

    const safeFileName = getSafeFileName(file.name) || 'background-music';
    const storagePath = `${parsed.data.siteId}/music/${Date.now()}-${safeFileName}`;
    logMusicUpload(requestId, 'storage:upload:start', { storagePath });
    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      logMusicUploadError(requestId, 'storage:upload:failed', uploadError, { storagePath });
      return NextResponse.json({ success: false, message: getSupabaseSetupMessage(uploadError.message) }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    logMusicUpload(requestId, 'request:success', {
      storagePath,
      publicUrl: publicUrlData.publicUrl,
    });

    return NextResponse.json({ success: true, musicUrl: publicUrlData.publicUrl, storagePath }, { status: 201 });
  } catch (error) {
    logMusicUploadError(requestId, 'request:unexpected-error', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Lỗi upload nhạc không xác định.' }, { status: 500 });
  }
}
