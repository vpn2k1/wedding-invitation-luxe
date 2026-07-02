import { NextRequest, NextResponse } from 'next/server';
import { mapAlbumImage } from '@/lib/supabase/mappers';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { AlbumImageRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const BUCKET_NAME = 'wedding-images';

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

function logAlbumReplace(requestId: string, step: string, details?: Record<string, unknown>) {
  console.info(`[admin-album-replace:${requestId}] ${step}`, details || {});
}

function logAlbumReplaceError(requestId: string, step: string, error: unknown, details?: Record<string, unknown>) {
  console.error(`[admin-album-replace:${requestId}] ${step}`, {
    ...details,
    error,
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const requestId = crypto.randomUUID();
  const supabase = createSupabaseAdminClient();
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  const { id } = await context.params;
  logAlbumReplace(requestId, 'request:start', { imageId: id, siteId });

  if (!supabase || !siteId) {
    logAlbumReplaceError(requestId, 'config:missing', 'Supabase admin client hoặc NEXT_PUBLIC_SITE_ID chưa được cấu hình.');
    return NextResponse.json({ success: false, message: 'Supabase admin client hoặc NEXT_PUBLIC_SITE_ID chưa được cấu hình.' }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      logAlbumReplaceError(requestId, 'file:missing', 'file field is missing');
      return NextResponse.json({ success: false, message: 'Thiếu file ảnh.' }, { status: 400 });
    }

    logAlbumReplace(requestId, 'file:received', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    if (!ALLOWED_TYPES.includes(file.type)) {
      logAlbumReplaceError(requestId, 'file:unsupported-type', file.type, { allowedTypes: ALLOWED_TYPES });
      return NextResponse.json({ success: false, message: 'Chỉ hỗ trợ JPEG, PNG hoặc WebP.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      logAlbumReplaceError(requestId, 'file:too-large', file.size, { maxFileSize: MAX_FILE_SIZE });
      return NextResponse.json({ success: false, message: 'File ảnh tối đa 5MB.' }, { status: 400 });
    }

    const { data: currentImage, error: findError } = await supabase
      .from('album_images')
      .select('*')
      .eq('id', id)
      .eq('site_id', siteId)
      .single();

    if (findError || !currentImage) {
      logAlbumReplaceError(requestId, 'database:find:failed', findError || 'missing row', { imageId: id });
      return NextResponse.json({ success: false, message: findError?.message || 'Không tìm thấy ảnh album.' }, { status: 404 });
    }

    const previousImage = currentImage as AlbumImageRow;
    const safeFileName = getSafeFileName(file.name) || 'album-image';
    const storagePath = `${siteId}/album/${Date.now()}-${safeFileName}`;
    logAlbumReplace(requestId, 'storage:upload:start', { storagePath });
    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      logAlbumReplaceError(requestId, 'storage:upload:failed', uploadError, { storagePath });
      return NextResponse.json({ success: false, message: getSupabaseSetupMessage(uploadError.message) }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    logAlbumReplace(requestId, 'database:update:start', { imageId: id, storagePath, publicUrl: publicUrlData.publicUrl });
    const { data: updatedImage, error: updateError } = await supabase
      .from('album_images')
      .update({
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('site_id', siteId)
      .select('*')
      .single();

    if (updateError || !updatedImage) {
      logAlbumReplaceError(requestId, 'database:update:failed', updateError || 'missing updated row', { storagePath });
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
      return NextResponse.json({ success: false, message: updateError?.message || 'Không thể cập nhật ảnh album.' }, { status: 500 });
    }

    let warning: string | undefined;
    if (previousImage.storage_path) {
      const { error: removeError } = await supabase.storage.from(BUCKET_NAME).remove([previousImage.storage_path]);
      warning = removeError?.message;
    }

    logAlbumReplace(requestId, 'request:success', { imageId: id, storagePath, warning });
    return NextResponse.json({ success: true, image: mapAlbumImage(updatedImage as AlbumImageRow), warning });
  } catch (error) {
    logAlbumReplaceError(requestId, 'request:unexpected-error', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Lỗi cập nhật ảnh không xác định.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const supabase = createSupabaseAdminClient();
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  const { id } = await context.params;

  if (!supabase || !siteId) {
    return NextResponse.json({ success: false, message: 'Supabase admin client hoặc NEXT_PUBLIC_SITE_ID chưa được cấu hình.' }, { status: 503 });
  }

  const { data: image, error: findError } = await supabase
    .from('album_images')
    .select('*')
    .eq('id', id)
    .eq('site_id', siteId)
    .single();

  if (findError || !image) {
    return NextResponse.json({ success: false, message: findError?.message || 'Không tìm thấy ảnh album.' }, { status: 404 });
  }

  const imageRow = image as AlbumImageRow;
  const { error: deleteError } = await supabase
    .from('album_images')
    .delete()
    .eq('id', id)
    .eq('site_id', siteId);

  if (deleteError) {
    return NextResponse.json({ success: false, message: deleteError.message }, { status: 500 });
  }

  if (imageRow.storage_path) {
    const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([imageRow.storage_path]);

    if (storageError) {
      return NextResponse.json({ success: true, warning: storageError.message });
    }
  }

  return NextResponse.json({ success: true });
}
