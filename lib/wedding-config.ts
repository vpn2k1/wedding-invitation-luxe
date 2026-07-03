export type WeddingConfig = {
  groomName: string;
  brideName: string;
  groomFullName: string;
  brideFullName: string;
  fullTitle: string;
  monogram: string;
  weddingDate: string;
  displayDate: string;
  shortDate: string;
  quote: string;
  coverImage: string;
  heroImage: string;
  brideImage: string;
  groomImage: string;
  musicUrl: string;
  ceremonyDate: string;
  ceremonyTime: string;
  ceremonyLocationName: string;
  ceremonyAddress: string;
  ceremonyMapUrl: string;
  receptionDate: string;
  receptionTime: string;
  receptionLocationName: string;
  receptionAddress: string;
  receptionMapUrl: string;
  afterPartyDate: string;
  afterPartyTime: string;
  afterPartyLocationName: string;
  afterPartyAddress: string;
  afterPartyMapUrl: string;
};

export const weddingConfig: WeddingConfig = {
  groomName: 'Chú rể',
  brideName: 'Cô dâu',
  groomFullName: 'Chú rể',
  brideFullName: 'Cô dâu',
  fullTitle: 'Cô dâu & Chú rể',
  monogram: 'C&C',
  weddingDate: '2026-12-20T18:00:00+07:00',
  displayDate: 'Chủ nhật, 20.12.2026',
  shortDate: '20 • 12 • 2026',
  quote: 'Một đời thương nhớ, một ngày nên duyên, một lời hẹn cùng nhau đi đến cuối con đường.',
  coverImage: '/images/luxe-cover.svg',
  heroImage: '/images/luxe-hero.svg',
  brideImage: '/images/bride.svg',
  groomImage: '/images/groom.svg',
  musicUrl: '/music/wedding-demo.mp3',
  ceremonyDate: '20.12.2026',
  ceremonyTime: '09:00',
  ceremonyLocationName: 'Tư gia nhà gái',
  ceremonyAddress: 'Đầm Rái, Nhuận Trạch, Lương Sơn, Phú Thọ',
  ceremonyMapUrl: 'https://maps.app.goo.gl/2hV7cEBN56ctUtJu5',
  receptionDate: '20.12.2026',
  receptionTime: '18:00',
  receptionLocationName: 'Tư gia nhà trai',
  receptionAddress: 'Đội 6 Phú Trạch, Mễ Sở, Hưng Yên',
  receptionMapUrl: 'https://maps.app.goo.gl/dLyZFtnbFTgYFmPe7',
  afterPartyDate: '20.12.2026',
  afterPartyTime: '21:00',
  afterPartyLocationName: 'Rooftop Lounge',
  afterPartyAddress: 'Hà Nội',
  afterPartyMapUrl: 'https://maps.app.goo.gl/after-party-map',
};
