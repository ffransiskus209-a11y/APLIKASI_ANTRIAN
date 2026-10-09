export function formatJam(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isoUntukAtribut(iso) {
  return iso ?? '';
}