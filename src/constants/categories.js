export const CATEGORIES = [
  { key: '식비', icon: 'restaurant-outline', color: '#FF8A65' },
  { key: '교통', icon: 'bus-outline', color: '#4FC3F7' },
  { key: '쇼핑', icon: 'bag-outline', color: '#BA68C8' },
  { key: '기타', icon: 'ellipsis-horizontal', color: '#90A4AE' },
];

export function getCategoryMeta(key) {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[3];
}
