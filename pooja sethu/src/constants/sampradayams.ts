export const SAMPRADAYAMS = [
  'Smartha',
  'Madhva',
  'Sri Vaishnava',
  'Vaikhanasa',
  'Pancharatra',
  'Samanya (General)',
  'Not sure',
  'Veerashaiva'
];

const SAMPRADAYAM_NAMES: Record<string, string> = {
  smartha: 'Smartha',
  madhva: 'Madhva',
  srivaishnava: 'Sri Vaishnava',
  vaikhanasa: 'Vaikhanasa',
  pancharatra: 'Pancharatra',
  samanya: 'Samanya (General)',
  unknown: 'Not sure',
  veerashaiva: 'Veerashaiva'
};

export const getSampradayamName = (value: string) =>
  SAMPRADAYAM_NAMES[value.toLowerCase()] || value;
