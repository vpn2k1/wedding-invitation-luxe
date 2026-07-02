import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { AlbumImageRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
    const { error: storageError } = await supabase.storage.from('wedding-images').remove([imageRow.storage_path]);

    if (storageError) {
      return NextResponse.json({ success: true, warning: storageError.message });
    }
  }

  return NextResponse.json({ success: true });
}
