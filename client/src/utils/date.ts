// "2026-10-23T01:20:00Z" → "2026. 10. 23." (브라우저 시간대 기준)
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR");
}
