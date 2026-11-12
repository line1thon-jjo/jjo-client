const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(dateString, now = Date.now()) {
  const time = new Date(dateString).getTime();
  if (Number.isNaN(time)) return "";

  const diff = Math.max(0, now - time);

  if (diff < MINUTE) return "방금 전";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}일 전`;

  const date = new Date(time);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
