import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getFallbackComments, mapGuestComment } from '@/lib/supabase/mappers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { GuestCommentRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

const commentSchema = z.object({
  siteId: z.string().uuid().optional(),
  name: z.string().trim().min(2, 'Tên cần có ít nhất 2 ký tự.').max(80, 'Tên tối đa 80 ký tự.'),
  message: z.string().trim().min(2, 'Lời chúc cần có ít nhất 2 ký tự.').max(500, 'Lời chúc tối đa 500 ký tự.'),
  attendanceStatus: z.enum(['attending', 'not_attending', 'maybe']).optional(),
  guestCount: z.coerce.number().int().min(1).max(20).optional(),
});

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim();
}

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get('siteId') || process.env.NEXT_PUBLIC_SITE_ID;
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') || 20), 100);
  const fallback = getFallbackComments().slice(0, limit);
  const supabase = createSupabaseServerClient();

  if (!supabase || !siteId) {
    return NextResponse.json({ comments: fallback });
  }

  try {
    const { data, error } = await supabase
      .from('guest_comments')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data?.length) {
      return NextResponse.json({ comments: fallback });
    }

    return NextResponse.json({ comments: (data as GuestCommentRow[]).map(mapGuestComment) });
  } catch {
    return NextResponse.json({ comments: fallback });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ success: false, message: 'Supabase chưa được cấu hình.' }, { status: 503 });
  }

  const parsed = commentSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const siteId = parsed.data.siteId || process.env.NEXT_PUBLIC_SITE_ID;

  if (!siteId) {
    return NextResponse.json({ success: false, message: 'Thiếu siteId cho website thiệp cưới.' }, { status: 400 });
  }

  const payload = {
    site_id: siteId,
    name: stripHtml(parsed.data.name),
    message: stripHtml(parsed.data.message),
    attendance_status: parsed.data.attendanceStatus || null,
    guest_count: parsed.data.guestCount || null,
    is_visible: true,
  };

  const { data, error } = await supabase.from('guest_comments').insert(payload).select('*').single();

  if (error || !data) {
    return NextResponse.json({ success: false, message: error?.message || 'Không thể gửi lời chúc lúc này.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, comment: mapGuestComment(data as GuestCommentRow) }, { status: 201 });
}
