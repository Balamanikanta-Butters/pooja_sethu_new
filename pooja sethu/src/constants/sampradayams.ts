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
  veerashaiva: 'Veerashaiva',
  '5872e56b-a237-489f-96be-078cb1f58f4e': 'Smartha',
  '2c7dce01-d5d5-4716-b6ad-131112bf2e37': 'Madhva',
  'cf656c6f-a2b0-4ddc-8f3d-3ac2c6f7a1aa': 'Sri Vaishnava',
  '9bcd1fc4-02b1-4782-abcf-713193368030': 'Vaikhanasa',
  'febf9905-b5c9-4a7c-83dc-318cb39fe2cd': 'Pancharatra',
  'f8adde3d-a7df-40d7-ace4-c9c75d16063c': 'Not sure',
  'b72d9511-ffcd-462a-b21c-ec1466fe40f1': 'Samanya (General)',
  'c5f19dd5-5f43-4830-a96a-8d552aa87eb3': 'Veerashaiva'
};

export const getSampradayamName = (value: string) => {
  if (!value) return '';
  const lower = value.toLowerCase().trim();
  if (SAMPRADAYAM_NAMES[lower]) return SAMPRADAYAM_NAMES[lower];
  // If it's an unmapped UUID, fallback to Smartha
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim())) {
    return 'Smartha';
  }
  return value;
};
