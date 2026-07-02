export type AttendanceStatus = 'attending' | 'not_attending' | 'maybe';

export type AlbumImage = {
  id: string;
  siteId: string;
  title?: string | null;
  description?: string | null;
  imageUrl: string;
  storagePath?: string | null;
  width?: number | null;
  height?: number | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt?: string | null;
};

export type GuestComment = {
  id: string;
  siteId: string;
  name: string;
  message: string;
  attendanceStatus?: AttendanceStatus | null;
  guestCount?: number | null;
  isVisible: boolean;
  createdAt: string;
};

export type BankQrItem = {
  ownerName: string;
  bankName: string;
  accountNumber: string;
  qrImage: string;
  note: string;
};

export type WeddingSiteSettings = {
  siteId: string;
  slug: string;
  brideName: string;
  groomName: string;
  fullTitle: string;
  weddingDate: string;
  displayDate: string;
  quote: string;
  coverImage: string;
  heroImage: string;
  brideImage: string;
  groomImage: string;
  musicUrl: string;
  brideDescription: string;
  groomDescription: string;
  qrItems: BankQrItem[];
  events: {
    title: string;
    date: string;
    time: string;
    locationName: string;
    address: string;
    mapUrl: string;
    description: string;
  }[];
  layout: {
    eventColumns: '2' | '3';
    showAlbum: boolean;
    showQr: boolean;
    showTimeline: boolean;
    showComments: boolean;
  };
  updatedAt?: string | null;
};

export type AlbumImageRow = {
  id: string;
  site_id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  storage_path: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string | null;
};

export type GuestCommentRow = {
  id: string;
  site_id: string;
  name: string;
  message: string;
  attendance_status: AttendanceStatus | null;
  guest_count: number | null;
  is_visible: boolean;
  created_at: string;
};

export type WeddingSiteSettingsRow = {
  site_id: string;
  settings: Partial<WeddingSiteSettings>;
  updated_at: string | null;
  wedding_sites?: {
    slug: string;
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
  } | null;
};
