# Wedding Invitation Luxe

Project mẫu thiệp cưới online serverless bằng **Next.js + TypeScript + Tailwind CSS**.

Bản này có giao diện luxe/editorial, admin quản lý nội dung và dùng Supabase chung với project thiệp cưới serverless. Mỗi website tách dữ liệu bằng `NEXT_PUBLIC_SITE_ID`.

## Điểm mới so với bản trước

- Giao diện luxe/editorial đẹp hơn, có cảm giác thiệp cao cấp.
- Trang mở thiệp có card lớn, ornament, hiệu ứng mở thiệp và phát nhạc.
- Trang thông tin cưới có hero lớn, countdown, thông tin cô dâu/chú rể, lịch trình, dress code, timeline, album, QR, guestbook.
- Trang album `/album` dạng storybook/photo book với trang chính, trang tiếp theo và thumbnail selector.
- Album và guestbook ưu tiên dữ liệu Supabase, fallback về `lib/wedding-data.ts`.
- Trang admin `/admin` có login, chỉnh nội dung/địa chỉ/bố cục và upload ảnh album.
- Ảnh demo là SVG tự tạo trong `public/images`, dễ thay bằng ảnh thật.

## Chạy local

```bash
npm install
npm run dev
```

Mở:

```txt
http://localhost:3000
```

## Supabase dùng chung

Tạo `.env.local` từ `.env.example`. Có thể dùng cùng `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` với project `wedding-invitation-serverless`, nhưng đặt `NEXT_PUBLIC_SITE_ID` riêng cho project luxe:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_ID=22222222-2222-4222-8222-222222222222
ADMIN_USERNAME=admin
ADMIN_PASSWORD=doi-mat-khau-nay
```

Chạy `supabase/schema.sql` một lần trên Supabase chung, sau đó chạy `supabase/seed.sql` của project này để tạo site luxe mẫu. Vào `/admin/login` bằng `ADMIN_USERNAME`/`ADMIN_PASSWORD`, rồi chỉnh nội dung tại `/admin`.

## Cấu trúc chính

```txt
app/
  page.tsx                 # Trang mở thiệp
  invitation/page.tsx      # Trang thông tin thiệp cưới
  album/page.tsx           # Trang album storybook
  admin/page.tsx           # Trang admin quản lý nội dung
  admin/login/page.tsx     # Trang login admin
  api/                     # API Supabase/admin

components/
  admin-dashboard.tsx
  site-settings-provider.tsx
  opening-card.tsx
  hero-section.tsx
  countdown-timer.tsx
  couple-section.tsx
  events-section.tsx
  timeline-section.tsx
  album-preview.tsx
  album-storybook.tsx
  qr-section.tsx
  comment-section.tsx
  music-provider.tsx
  music-toggle.tsx

lib/
  wedding-data.ts          # Dữ liệu mẫu
  supabase/                # Supabase clients, types, mappers

supabase/
  schema.sql
  seed.sql

public/
  images/
  music/
```

## Chỉnh nội dung thiệp

Mở file:

```txt
lib/wedding-data.ts
```

Bạn có thể đổi:

- Tên cô dâu/chú rể
- Ngày cưới
- Quote
- Ảnh cover/hero/cô dâu/chú rể
- Lịch trình cưới
- Timeline câu chuyện tình yêu
- Album ảnh
- QR chuyển khoản
- Lời chúc mẫu

## Thay ảnh thật

Đặt ảnh thật vào:

```txt
public/images/
```

Ví dụ:

```txt
public/images/cover.jpg
public/images/hero.jpg
public/images/album-1.jpg
```

Sau đó sửa đường dẫn trong `lib/wedding-data.ts`:

```ts
coverImage: '/images/cover.jpg'
```

## Thay nhạc

Đặt file nhạc vào:

```txt
public/music/wedding.mp3
```

Sau đó sửa:

```ts
musicUrl: '/music/wedding.mp3'
```

Lưu ý: trình duyệt chỉ cho phát nhạc sau khi người dùng có tương tác, nên nhạc được phát khi bấm **Mở thiệp**.

## Admin

Tài khoản admin không lấy từ Supabase Auth. Đây là user/pass đơn giản do bạn tự đặt trong `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=doi-mat-khau-nay
```

Sau khi login, admin có thể chỉnh thông tin cô dâu/chú rể, quote, ảnh chính, địa chỉ/sự kiện, bật/tắt một số section, đổi bố cục sự kiện và upload ảnh album.

## Nguồn cảm hứng thiết kế

Không copy y nguyên template nào. Giao diện lấy cảm hứng tổng quát từ các hướng:

- Wedding website hiện đại kiểu editorial/minimal.
- Landing page có ảnh lớn, typography serif, CTA RSVP.
- Album cưới dạng storybook/photo book.
- Thiệp cưới online có phần timeline, RSVP, QR và guestbook.
