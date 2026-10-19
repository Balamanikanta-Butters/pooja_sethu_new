export type PoojaItem = {
  id: string;
  title: string;
  teluguTitle: string;
  category: 'gruha' | 'samskaras' | 'vratams' | 'homams' | 'pitru' | 'festivals' | 'business';
  description: string;
  duration: string;
  price: number;
  illustrationType: 'house' | 'vastu' | 'bhoomi' | 'satyanarayana' | 'homam' | 'abdikam' | 'upanyanam';
  image?: string;
};

export type MuhurthamItem = {
  id: string;
  month: string;
  day: string;
  weekday: string;
  title: string;
  iconType: 'gruha' | 'vratam' | 'samskara';
  timeRange: string;
  details: string;
  badge: 'Best' | 'Filling fast' | 'Good';
};

export type FestivalItem = {
  id: string;
  title: string;
  teluguTitle: string;
  dateRange: string;
  tag: string;
  artType: 'mahalaya' | 'navaratri' | 'deepavali';
};

export type PanchangamData = {
  dateStr: string;
  city: string;
  specialNote: string;
  tithi: string;
  nakshatram: string;
  masam: string;
  sunriseSunset?: string;
  amritaKalam?: string;
  abhijit?: string;
  rahuKalam: string;
  yamagandam: string;
  durmuhurtham?: string;
  varjyam?: string;
  rutuvu?: string;
  ayanam?: string;
  kalam?: string;
  yogam?: string;
  karanam?: string;
  paksham?: string;
};
