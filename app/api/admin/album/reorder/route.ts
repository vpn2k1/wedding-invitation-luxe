import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const reorderSchema = z.object({
  imageIds: z.array(z.string().uuid()).min(1),
});

export async function PATCH(request: NextRequest) {
  const supabase = createSupabaseAdminClient();
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;

  if (!supabase || !siteId) {
    return NextResponse.json({ success: false, message: 'Supabase admin client hoặc NEXT_PUBLIC_SITE_ID chưa được cấu hình.' }, { status: 503 });
  }

  const parsed = reorderSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message || 'Thứ tự ảnh không hợp lệ.' }, { status: 400 });
  }

  const updates = await Promise.all(
    parsed.data.imageIds.map((id, index) =>
      supabase
        .from('album_images')
        .update({ sort_order: index + 1 })
        .eq('id', id)
        .eq('site_id', siteId)
    )
  );
  const failedUpdate = updates.find((result) => result.error);

  if (failedUpdate?.error) {
    return NextResponse.json({ success: false, message: failedUpdate.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
