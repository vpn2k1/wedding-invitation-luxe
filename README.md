# Wedding Invitation Luxe

Project mẫu thiệp cưới online serverless bằng **Next.js + TypeScript + Tailwind CSS**.

Bản này dùng web public và app admin chung qua cùng một Supabase database, cùng `NEXT_PUBLIC_SITE_ID`:

- Project web public ở thư mục gốc: hiển thị thiệp, album, guestbook.
- Project admin dùng chung ở `../wedding-admin-app`: đăng nhập, chỉnh nội dung, upload ảnh/nhạc.

## Điểm mới so với bản trước

- Giao diện luxe/editorial đẹp hơn, có cảm giác thiệp cao cấp.
- Trang mở thiệp có card lớn, ornament, hiệu ứng mở thiệp và phát nhạc.
- Trang thông tin cưới có hero lớn, countdown, thông tin cô dâu/chú rể, lịch trình, dress code, timeline, album, QR, guestbook.
- Trang album `/album` dạng storybook/photo book với trang chính, trang tiếp theo và thumbnail selector.
- Album và guestbook ưu tiên dữ liệu Supabase, fallback về `lib/wedding-data.ts`.
- Admin dùng chung ở `../wedding-admin-app`, có login, chỉnh nội dung/địa chỉ/bố cục và upload ảnh album.
- Ảnh demo là SVG tự tạo trong `public/images`, dễ thay bằng ảnh thật.

## Chạy local

Web public:

```bash
npm install
npm run dev
```

Mở:

```txt
http://localhost:3000
```

Admin dùng chung:

```bash
npm run dev:admin
```

Mở:

```txt
http://localhost:3001/admin
```

## Supabase dùng chung

Tạo `.env.local` từ `.env.example` cho web public và tạo `../wedding-admin-app/.env.local` từ `../wedding-admin-app/.env.example` cho admin. Hai file env cần dùng cùng `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` và cùng `NEXT_PUBLIC_SITE_ID`. Riêng admin cần thêm `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_ID=11111111-1111-4111-8111-111111111111
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=doi-mat-khau-nay
```

Chạy `supabase/schema.sql` một lần trên Supabase chung, sau đó chạy một file seed cho dữ liệu mẫu. Nếu web public và `../wedding-admin-app` dùng chung `NEXT_PUBLIC_SITE_ID`, admin sẽ sửa cùng bảng `site_settings`, `album_images` và `guest_comments` mà web đang đọc.

## Cấu trúc chính

```txt
app/
  page.tsx                 # Trang mở thiệp
  invitation/page.tsx      # Trang thông tin thiệp cưới
  album/page.tsx           # Trang album storybook
  api/                     # API public đọc Supabase

components/
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

../wedding-admin-app/
  app/admin/page.tsx       # Trang admin quản lý nội dung
  app/admin/login/page.tsx # Trang login admin
  app/api/admin/           # API admin ghi Supabase
  components/
  lib/

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

## Admin dùng chung

Tài khoản admin không lấy từ Supabase Auth. Đây là user/pass đơn giản do bạn tự đặt trong `../wedding-admin-app/.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=doi-mat-khau-nay
```

Sau khi login ở `http://localhost:3001/admin`, admin có thể chỉnh thông tin cô dâu/chú rể, quote, ảnh chính, địa chỉ/sự kiện, bật/tắt một số section, đổi bố cục sự kiện và upload ảnh album. Web public ở `http://localhost:3000` sẽ đọc lại cùng dữ liệu Supabase.

## Nguồn cảm hứng thiết kế

Không copy y nguyên template nào. Giao diện lấy cảm hứng tổng quát từ các hướng:

- Wedding website hiện đại kiểu editorial/minimal.
- Landing page có ảnh lớn, typography serif, CTA RSVP.
- Album cưới dạng storybook/photo book.
- Thiệp cưới online có phần timeline, RSVP, QR và guestbook.
