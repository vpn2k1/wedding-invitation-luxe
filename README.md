# Wedding Invitation Luxe

Project mẫu thiệp cưới online serverless bằng **Next.js + TypeScript + Tailwind CSS**.

Bản này tập trung làm trước phần hiển thị thiệp, chưa làm admin/database/upload ảnh. Cấu trúc dữ liệu đã để trong `lib/wedding-data.ts` để sau này dễ chuyển sang API + database.

## Điểm mới so với bản trước

- Giao diện luxe/editorial đẹp hơn, có cảm giác thiệp cao cấp.
- Trang mở thiệp có card lớn, ornament, hiệu ứng mở thiệp và phát nhạc.
- Trang thông tin cưới có hero lớn, countdown, thông tin cô dâu/chú rể, lịch trình, dress code, timeline, album, QR, guestbook.
- Trang album `/album` dạng storybook/photo book với trang chính, trang tiếp theo và thumbnail selector.
- Dữ liệu ảnh, nội dung, QR, lời chúc mẫu tách riêng trong `lib/wedding-data.ts`.
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

## Cấu trúc chính

```txt
app/
  page.tsx                 # Trang mở thiệp
  invitation/page.tsx      # Trang thông tin thiệp cưới
  album/page.tsx           # Trang album storybook

components/
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

## Phần admin/database sẽ làm sau

Gợi ý bước tiếp theo:

1. Thêm Prisma + Neon PostgreSQL.
2. Tạo model `AlbumImage`, `GuestComment`, `WeddingConfig`, `WeddingEvent`, `BankQr`.
3. Tạo API `/api/album`, `/api/comments`, `/api/config`.
4. Tạo `/admin/login` và `/admin/album`.
5. Dùng Cloudinary hoặc UploadThing để upload ảnh.
6. Đổi `lib/wedding-data.ts` sang fetch từ API.

## Nguồn cảm hứng thiết kế

Không copy y nguyên template nào. Giao diện lấy cảm hứng tổng quát từ các hướng:

- Wedding website hiện đại kiểu editorial/minimal.
- Landing page có ảnh lớn, typography serif, CTA RSVP.
- Album cưới dạng storybook/photo book.
- Thiệp cưới online có phần timeline, RSVP, QR và guestbook.
