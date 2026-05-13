export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString('ko-KR') + '원';
}

export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function currentYearMonth() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function formatDateKorean(isoDate) {
  // isoDate: 'YYYY-MM-DD'
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${y}.${m}.${d}`;
}
