import { NextRequest, NextResponse } from 'next/server';
import { getFallbackSiteSettings, mapSiteSettings } from '@/lib/supabase/mappers';
import { siteSettingsSchema } from '@/lib/supabase/settings-schema';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { WeddingSiteSettingsRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  const supabase = createSupabaseAdminClient();

  if (!supabase || !siteId) {
    return NextResponse.json({ settings: getFallbackSiteSettings() });
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('site_id, settings, updated_at, wedding_sites(slug, bride_name, groom_name, wedding_date)')
    .eq('site_id', siteId)
    .single();

  if (error || !data) {
    return NextResponse.json({ settings: getFallbackSiteSettings() });
  }

  return NextResponse.json({ settings: mapSiteSettings(data as unknown as WeddingSiteSettingsRow) });
}

export async function PUT(request: NextRequest) {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  const supabase = createSupabaseAdminClient();

  if (!supabase || !siteId) {
    return NextResponse.json({ success: false, message: 'Supabase admin client hoặc NEXT_PUBLIC_SITE_ID chưa được cấu hình.' }, { status: 503 });
  }

  const parsed = siteSettingsSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message || 'Dữ liệu cấu hình không hợp lệ.' }, { status: 400 });
  }

  const settings = {
    ...parsed.data,
    siteId,
  };

  const { error: siteError } = await supabase
    .from('wedding_sites')
    .update({
      slug: settings.slug,
      bride_name: settings.brideName,
      groom_name: settings.groomName,
      wedding_date: settings.weddingDate,
    })
    .eq('id', siteId);

  if (siteError) {
    return NextResponse.json({ success: false, message: siteError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ site_id: siteId, settings }, { onConflict: 'site_id' })
    .select('site_id, settings, updated_at, wedding_sites(slug, bride_name, groom_name, wedding_date)')
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, message: error?.message || 'Không thể lưu cấu hình.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, settings: mapSiteSettings(data as unknown as WeddingSiteSettingsRow) });
}
