import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mapAlbumImage } from '@/lib/supabase/mappers';
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

function getSafeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
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
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message || 'Metadata không hợp lệ.' }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: 'Thiếu file ảnh.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ success: false, message: 'Chỉ hỗ trợ JPEG, PNG hoặc WebP.' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ success: false, message: 'File ảnh tối đa 5MB.' }, { status: 400 });
  }

  const safeFileName = getSafeFileName(file.name) || 'album-image';
  const storagePath = `${parsed.data.siteId}/album/${Date.now()}-${safeFileName}`;
  const { error: uploadError } = await supabase.storage.from('wedding-images').upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ success: false, message: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from('wedding-images').getPublicUrl(storagePath);
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
    await supabase.storage.from('wedding-images').remove([storagePath]);
    return NextResponse.json({ success: false, message: error?.message || 'Không thể lưu metadata ảnh.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, image: mapAlbumImage(data as AlbumImageRow) }, { status: 201 });
}
