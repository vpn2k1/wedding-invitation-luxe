import { z } from 'zod';

export const weddingEventSchema = z.object({
  title: z.string().trim().min(1).max(120),
  date: z.string().trim().min(1).max(40),
  time: z.string().trim().min(1).max(40),
  locationName: z.string().trim().min(1).max(160),
  address: z.string().trim().min(1).max(240),
  mapUrl: z.string().trim().url().or(z.literal('')),
  description: z.string().trim().max(500),
});

export const bankQrItemSchema = z.object({
  ownerName: z.string().trim().min(1).max(120),
  bankName: z.string().trim().min(1).max(120),
  accountNumber: z.string().trim().min(1).max(80),
  qrImage: z.string().trim().min(1).max(500),
  note: z.string().trim().max(500),
});

export const siteSettingsSchema = z.object({
  siteId: z.string().uuid(),
  slug: z.string().trim().min(1).max(120),
  brideName: z.string().trim().min(1).max(80),
  groomName: z.string().trim().min(1).max(80),
  fullTitle: z.string().trim().min(1).max(180),
  weddingDate: z.string().trim().min(1).max(80),
  displayDate: z.string().trim().min(1).max(40),
  quote: z.string().trim().max(300),
  coverImage: z.string().trim().max(500),
  heroImage: z.string().trim().max(500),
  brideImage: z.string().trim().max(500),
  groomImage: z.string().trim().max(500),
  musicUrl: z.string().trim().max(500),
  brideDescription: z.string().trim().max(500),
  groomDescription: z.string().trim().max(500),
  qrItems: z.array(bankQrItemSchema).min(1).max(6),
  events: z.array(weddingEventSchema).min(1).max(6),
  layout: z.object({
    eventColumns: z.enum(['2', '3']),
    showAlbum: z.boolean(),
    showQr: z.boolean(),
    showTimeline: z.boolean(),
    showComments: z.boolean(),
  }),
});
