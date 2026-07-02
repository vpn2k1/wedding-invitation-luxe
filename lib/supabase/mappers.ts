import { albumImages, bankQrList, events, initialComments, weddingConfig, couple } from '@/lib/wedding-data';
import type { AlbumImage, AlbumImageRow, GuestComment, GuestCommentRow, WeddingSiteSettings, WeddingSiteSettingsRow } from '@/lib/supabase/types';

const fallbackSiteId = process.env.NEXT_PUBLIC_SITE_ID || 'static-site';

export function mapAlbumImage(row: AlbumImageRow): AlbumImage {
  return {
    id: row.id,
    siteId: row.site_id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    storagePath: row.storage_path,
    width: row.width,
    height: row.height,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapGuestComment(row: GuestCommentRow): GuestComment {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    message: row.message,
    attendanceStatus: row.attendance_status,
    guestCount: row.guest_count,
    isVisible: row.is_visible,
    createdAt: row.created_at,
  };
}

export function getFallbackAlbumImages(): AlbumImage[] {
  return albumImages.map((image, index) => ({
    id: image.id,
    siteId: fallbackSiteId,
    title: image.title,
    description: image.description,
    imageUrl: image.src,
    storagePath: null,
    width: null,
    height: null,
    sortOrder: index,
    isVisible: true,
    createdAt: new Date(0).toISOString(),
    updatedAt: null,
  }));
}

export function getFallbackComments(): GuestComment[] {
  return initialComments.map((comment, index) => ({
    id: `fallback-${index}`,
    siteId: fallbackSiteId,
    name: comment.name,
    message: comment.message,
    attendanceStatus: null,
    guestCount: null,
    isVisible: true,
    createdAt: new Date(Date.now() - index * 60_000).toISOString(),
  }));
}

export function getFallbackSiteSettings(): WeddingSiteSettings {
  return {
    siteId: fallbackSiteId,
    slug: 'ha-nhi-phuong-nam',
    brideName: weddingConfig.brideName,
    groomName: weddingConfig.groomName,
    fullTitle: weddingConfig.fullTitle,
    weddingDate: weddingConfig.weddingDate,
    displayDate: weddingConfig.displayDate,
    quote: weddingConfig.quote,
    coverImage: weddingConfig.coverImage,
    heroImage: weddingConfig.heroImage,
    brideImage: weddingConfig.brideImage,
    groomImage: weddingConfig.groomImage,
    musicUrl: weddingConfig.musicUrl,
    brideDescription: couple.bride.description,
    groomDescription: couple.groom.description,
    qrItems: bankQrList,
    events,
    layout: {
      eventColumns: '3',
      showAlbum: true,
      showQr: true,
      showTimeline: true,
      showComments: true,
    },
    updatedAt: null,
  };
}

export function mapSiteSettings(row: WeddingSiteSettingsRow): WeddingSiteSettings {
  const fallback = getFallbackSiteSettings();
  const settings = row.settings || {};

  return {
    ...fallback,
    ...settings,
    siteId: row.site_id,
    slug: settings.slug || row.wedding_sites?.slug || fallback.slug,
    brideName: settings.brideName || row.wedding_sites?.bride_name || fallback.brideName,
    groomName: settings.groomName || row.wedding_sites?.groom_name || fallback.groomName,
    fullTitle: settings.fullTitle || `${settings.brideName || row.wedding_sites?.bride_name || fallback.brideName} & ${settings.groomName || row.wedding_sites?.groom_name || fallback.groomName}`,
    weddingDate: settings.weddingDate || row.wedding_sites?.wedding_date || fallback.weddingDate,
    coverImage: settings.coverImage || fallback.coverImage,
    heroImage: settings.heroImage || fallback.heroImage,
    brideImage: settings.brideImage || fallback.brideImage,
    groomImage: settings.groomImage || fallback.groomImage,
    qrItems: settings.qrItems?.length ? settings.qrItems : fallback.qrItems,
    events: settings.events?.length ? settings.events : fallback.events,
    layout: {
      ...fallback.layout,
      ...settings.layout,
    },
    updatedAt: row.updated_at,
  };
}
