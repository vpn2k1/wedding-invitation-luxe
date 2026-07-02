import { NextRequest, NextResponse } from 'next/server';
import { getFallbackSiteSettings, mapSiteSettings } from '@/lib/supabase/mappers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { WeddingSiteSettingsRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get('siteId') || process.env.NEXT_PUBLIC_SITE_ID;
  const fallback = getFallbackSiteSettings();
  const supabase = createSupabaseServerClient();

  if (!supabase || !siteId) {
    return NextResponse.json({ settings: fallback });
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('site_id, settings, updated_at, wedding_sites(slug, bride_name, groom_name, wedding_date)')
      .eq('site_id', siteId)
      .single();

    if (error || !data) {
      return NextResponse.json({ settings: fallback });
    }

    return NextResponse.json({ settings: mapSiteSettings(data as unknown as WeddingSiteSettingsRow) });
  } catch {
    return NextResponse.json({ settings: fallback });
  }
}
