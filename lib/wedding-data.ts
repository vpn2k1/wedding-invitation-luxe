import { weddingConfig } from './wedding-config';

export { weddingConfig } from './wedding-config';

export type WeddingEvent = {
  title: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  mapUrl: string;
  description: string;
  accent: string;
};

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  image: string;
};

export type AlbumImage = {
  id: string;
  src: string;
  title: string;
  description: string;
};

export type DressCode = {
  label: string;
  color: string;
  note?: string;
};


export const couple = {
  bride: {
    name: weddingConfig.brideFullName,
    role: 'Cô dâu',
    description: 'Yêu những buổi sáng có nắng, những bó hoa nhỏ và những điều bình yên được tạo nên từ sự chân thành.',
    image: weddingConfig.brideImage,
  },
  groom: {
    name: weddingConfig.groomFullName,
    role: 'Chú rể',
    description: 'Điềm tĩnh, ấm áp và luôn tin rằng nhà là nơi có người mình thương cùng trở về sau mỗi ngày dài.',
    image: weddingConfig.groomImage,
  },
};

export const events: WeddingEvent[] = [
  {
    title: 'Lễ Gia Tiên',
    date: weddingConfig.ceremonyDate,
    time: weddingConfig.ceremonyTime,
    locationName: weddingConfig.ceremonyLocationName,
    address: weddingConfig.ceremonyAddress,
    mapUrl: weddingConfig.ceremonyMapUrl,
    description: 'Nghi lễ thân mật cùng gia đình hai bên, bắt đầu cho ngày vui trọn vẹn.',
    accent: 'Morning Ceremony',
  },
  {
    title: 'Tiệc Cưới',
    date: weddingConfig.receptionDate,
    time: weddingConfig.receptionTime,
    locationName: weddingConfig.receptionLocationName,
    address: weddingConfig.receptionAddress,
    mapUrl: weddingConfig.receptionMapUrl,
    description: 'Một buổi tối có ánh nến, âm nhạc và sự hiện diện quý giá của những người thân yêu.',
    accent: 'Main Reception',
  },
  {
    title: 'After Party',
    date: weddingConfig.afterPartyDate,
    time: weddingConfig.afterPartyTime,
    locationName: weddingConfig.afterPartyLocationName,
    address: weddingConfig.afterPartyAddress,
    mapUrl: weddingConfig.afterPartyMapUrl,
    description: 'Một chút nhạc nhẹ, bánh ngọt và những lời chúc muộn trong không gian rooftop ấm áp.',
    accent: 'Sweet Ending',
  },
];

export const timeline: TimelineItem[] = [
  {
    date: '03.06.2020',
    title: 'Lần đầu gặp nhau',
    description: 'Một chiều mưa nhỏ, hai người xa lạ ngồi cạnh nhau trong quán cà phê và bắt đầu một câu chuyện không định trước.',
    image: '/images/album-1.svg',
  },
  {
    date: '12.12.2021',
    title: 'Chính thức bên nhau',
    description: 'Từ những tin nhắn rất dài, những buổi hẹn rất ngắn, chúng mình chọn cùng nhau đi qua nhiều mùa trong đời.',
    image: '/images/album-2.svg',
  },
  {
    date: '14.02.2025',
    title: 'Lời cầu hôn',
    description: 'Không cần quá nhiều lời hoa mỹ, chỉ cần một câu hỏi dịu dàng và một cái gật đầu đầy nước mắt.',
    image: '/images/album-3.svg',
  },
  {
    date: '20.12.2026',
    title: 'Ngày chung đôi',
    description: 'Hôm nay, chúng mình muốn cùng bạn lưu lại khoảnh khắc bắt đầu của một gia đình nhỏ.',
    image: '/images/album-4.svg',
  },
];

export const albumImages: AlbumImage[] = [
  { id: '1', src: '/images/album-1.svg', title: 'Buổi sáng có nắng', description: 'Ánh sáng đầu ngày, một chiếc váy trắng và nụ cười rất khẽ.' },
  { id: '2', src: '/images/album-2.svg', title: 'Bên hiên nhà', description: 'Khoảnh khắc bình yên như cách chúng mình muốn giữ nhau mỗi ngày.' },
  { id: '3', src: '/images/album-3.svg', title: 'Lời hẹn', description: 'Một lời hẹn giản dị nhưng đủ ấm cho cả chặng đường phía trước.' },
  { id: '4', src: '/images/album-4.svg', title: 'Dưới vòm hoa', description: 'Nơi mọi điều dịu dàng được lưu lại trong khung hình.' },
  { id: '5', src: '/images/album-5.svg', title: 'Chiều vàng', description: 'Hoàng hôn rơi xuống, câu chuyện của chúng mình trở nên ấm hơn.' },
  { id: '6', src: '/images/album-6.svg', title: 'Ngày vui', description: 'Cảm ơn vì đã cùng chúng mình đi đến khoảnh khắc này.' },
];

export const dressCodes: DressCode[] = [
  { label: 'Trắng', color: '#ffffff', note: 'Tinh khôi' },
  { label: 'Hồng phấn', color: '#ffd1da', note: 'Nhẹ nhàng' },
  { label: 'Hồng đậm', color: '#ff7f96', note: 'Lãng mạn' },
  { label: 'Đỏ rượu', color: '#b10f2e', note: 'Nổi bật' },
];

export const bankQrList = [
  {
    ownerName: 'Cô dâu',
    bankName: 'Vietcombank',
    accountNumber: '0123456789',
    qrImage: '/images/qr-bride.svg',
    note: 'Cảm ơn bạn đã đến chung vui cùng chúng mình. Món quà của bạn sẽ là kỷ niệm đẹp cho ngày trọng đại này.',
  },
  {
    ownerName: 'Chú rể',
    bankName: 'Techcombank',
    accountNumber: '9876543210',
    qrImage: '/images/qr-groom.svg',
    note: 'Cảm ơn bạn đã đến chung vui cùng chúng mình. Món quà của bạn sẽ là kỷ niệm đẹp cho ngày trọng đại này.',
  },
];

export const initialComments = [
  {
    name: 'Gia đình cô Lan',
    message: 'Chúc hai con trăm năm hạnh phúc, luôn yêu thương và đồng hành cùng nhau.',
    time: '2 giờ trước',
  },
  {
    name: 'Tuấn Anh',
    message: 'Chúc mừng Khôi và An! Hẹn gặp hai bạn trong ngày vui nhé.',
    time: '5 giờ trước',
  },
  {
    name: 'Nhóm bạn đại học',
    message: 'Mong hai bạn luôn giữ được nụ cười như hôm nay. Happy wedding!',
    time: 'Hôm qua',
  },
  {
    name: 'Minh Thư',
    message: 'Thiệp rất xinh, chúc hai bạn có một đám cưới thật trọn vẹn và một đời bình an bên nhau.',
    time: 'Hôm qua',
  },
];
