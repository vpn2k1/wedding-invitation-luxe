insert into public.wedding_sites (id, slug, bride_name, groom_name, wedding_date, is_active)
values (
  '11111111-1111-4111-8111-111111111111',
  'ha-nhi-phuong-nam',
  'Hà Nhi',
  'Phương Nam',
  '2026-12-20T18:00:00+07:00',
  true
)
on conflict (slug) do update set
  bride_name = excluded.bride_name,
  groom_name = excluded.groom_name,
  wedding_date = excluded.wedding_date,
  is_active = excluded.is_active;

insert into public.album_images (site_id, title, description, image_url, storage_path, sort_order, is_visible)
values
  ('11111111-1111-4111-8111-111111111111', 'Buổi sáng có nắng', 'Ánh sáng đầu ngày, một chiếc váy trắng và nụ cười rất khẽ.', '/images/album-1.svg', null, 1, true),
  ('11111111-1111-4111-8111-111111111111', 'Bên hiên nhà', 'Khoảnh khắc bình yên như cách chúng mình muốn giữ nhau mỗi ngày.', '/images/album-2.svg', null, 2, true),
  ('11111111-1111-4111-8111-111111111111', 'Lời hẹn', 'Một lời hẹn giản dị nhưng đủ ấm cho cả chặng đường phía trước.', '/images/album-3.svg', null, 3, true),
  ('11111111-1111-4111-8111-111111111111', 'Dưới vòm hoa', 'Nơi mọi điều dịu dàng được lưu lại trong khung hình.', '/images/album-4.svg', null, 4, true),
  ('11111111-1111-4111-8111-111111111111', 'Chiều vàng', 'Hoàng hôn rơi xuống, câu chuyện của chúng mình trở nên ấm hơn.', '/images/album-5.svg', null, 5, true),
  ('11111111-1111-4111-8111-111111111111', 'Ngày vui', 'Cảm ơn vì đã cùng chúng mình đi đến khoảnh khắc này.', '/images/album-6.svg', null, 6, true);

insert into public.site_settings (site_id, settings)
values (
  '11111111-1111-4111-8111-111111111111',
  '{
    "siteId": "11111111-1111-4111-8111-111111111111",
    "slug": "ha-nhi-phuong-nam",
    "brideName": "Hà Nhi",
    "groomName": "Phương Nam",
    "fullTitle": "Hà Nhi & Phương Nam",
    "weddingDate": "2026-12-20T18:00:00+07:00",
    "displayDate": "Chủ nhật, 20.12.2026",
    "quote": "Một đời thương nhớ, một ngày nên duyên, một lời hẹn cùng nhau đi đến cuối con đường.",
    "coverImage": "/images/luxe-cover.svg",
    "heroImage": "/images/luxe-hero.svg",
    "brideImage": "/images/bride.svg",
    "groomImage": "/images/groom.svg",
    "musicUrl": "/music/wedding-demo.mp3",
    "brideDescription": "Yêu những buổi sáng có nắng, những bó hoa nhỏ và những điều bình yên được tạo nên từ sự chân thành.",
    "groomDescription": "Điềm tĩnh, ấm áp và luôn tin rằng nhà là nơi có người mình thương cùng trở về sau mỗi ngày dài.",
    "qrItems": [
      { "ownerName": "Cô dâu", "bankName": "Vietcombank", "accountNumber": "0123456789", "qrImage": "/images/qr-bride.svg", "note": "Cảm ơn bạn đã đến chung vui cùng chúng mình. Món quà của bạn sẽ là kỷ niệm đẹp cho ngày trọng đại này." },
      { "ownerName": "Chú rể", "bankName": "Techcombank", "accountNumber": "9876543210", "qrImage": "/images/qr-groom.svg", "note": "Cảm ơn bạn đã đến chung vui cùng chúng mình. Món quà của bạn sẽ là kỷ niệm đẹp cho ngày trọng đại này." }
    ],
    "events": [
      { "title": "Lễ Gia Tiên", "date": "20.12.2026", "time": "09:00", "locationName": "Tư gia nhà gái", "address": "Đầm Rái, Nhuận Trạch, Lương Sơn, Phú Thọ", "mapUrl": "https://maps.app.goo.gl/2hV7cEBN56ctUtJu5", "description": "Nghi lễ thân mật cùng gia đình hai bên, bắt đầu cho ngày vui trọn vẹn." },
      { "title": "Tiệc Cưới", "date": "20.12.2026", "time": "18:00", "locationName": "Tư gia nhà trai", "address": "Đội 6 Phú Trạch, Mễ Sở, Hưng Yên", "mapUrl": "https://maps.app.goo.gl/dLyZFtnbFTgYFmPe7", "description": "Một buổi tối có ánh nến, âm nhạc và sự hiện diện quý giá của những người thân yêu." },
      { "title": "After Party", "date": "20.12.2026", "time": "21:00", "locationName": "Rooftop Lounge", "address": "Hà Nội", "mapUrl": "https://maps.app.goo.gl/after-party-map", "description": "Một chút nhạc nhẹ, bánh ngọt và những lời chúc muộn trong không gian rooftop ấm áp." }
    ],
    "layout": { "eventColumns": "3", "showAlbum": true, "showQr": true, "showTimeline": true, "showComments": true }
  }'::jsonb
)
on conflict (site_id) do update set settings = excluded.settings;

insert into public.guest_comments (site_id, name, message, attendance_status, guest_count, is_visible, created_at)
values
  ('11111111-1111-4111-8111-111111111111', 'Gia đình cô Lan', 'Chúc hai con trăm năm hạnh phúc, luôn yêu thương và đồng hành cùng nhau.', 'attending', 2, true, now() - interval '2 hours'),
  ('11111111-1111-4111-8111-111111111111', 'Tuấn Anh', 'Chúc mừng Nam và Nhi! Hẹn gặp hai bạn trong ngày vui nhé.', 'attending', 1, true, now() - interval '5 hours'),
  ('11111111-1111-4111-8111-111111111111', 'Nhóm bạn đại học', 'Mong hai bạn luôn giữ được nụ cười như hôm nay. Happy wedding!', 'maybe', 4, true, now() - interval '1 day'),
  ('11111111-1111-4111-8111-111111111111', 'Minh Thư', 'Thiệp rất xinh, chúc hai bạn có một đám cưới thật trọn vẹn và một đời bình an bên nhau.', 'attending', 1, true, now() - interval '2 days'),
  ('11111111-1111-4111-8111-111111111111', 'Anh Đức', 'Thật vui khi được chứng kiến ngày đặc biệt này. Chúc mừng hai bạn!', 'not_attending', 1, true, now() - interval '3 days');
