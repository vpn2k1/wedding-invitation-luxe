import { NextRequest, NextResponse } from 'next/server';
import { getFallbackAlbumImages, mapAlbumImage } from '@/lib/supabase/mappers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { AlbumImageRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get('siteId') || process.env.NEXT_PUBLIC_SITE_ID;
  const fallback = getFallbackAlbumImages();
  const supabase = createSupabaseServerClient();

  if (!supabase || !siteId) {
    return NextResponse.json({ images: fallback });
  }

  try {
    const { data, error } = await supabase
      .from('album_images')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data?.length) {
      return NextResponse.json({ images: fallback });
    }

    return NextResponse.json({ images: (data as AlbumImageRow[]).map(mapAlbumImage) });
  } catch {
    return NextResponse.json({ images: fallback });
  }
}
