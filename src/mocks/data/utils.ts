import type { LocalizableText } from '../../api/model';

export const lt = (en: string, ru: string, be: string): LocalizableText => ({
  en,
  ru,
  be,
});

const DAY_MS = 86_400_000;

// Даты считаются от «сегодня», чтобы ближайшие события всегда оставались в будущем.
export const at = (dayOffset: number, hourUtc: number, minuteUtc = 0) => {
  const now = new Date();
  const base = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hourUtc,
    minuteUtc,
  );
  return new Date(base + dayOffset * DAY_MS).toISOString();
};

// Картинка-заглушка без обращения к сети.
export const placeholder = (label: string, background = '#0D2C99') =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">` +
      `<rect width="1200" height="630" fill="${background}"/>` +
      `<text x="600" y="315" fill="#ffffff" font-family="sans-serif" font-size="64" font-weight="700" text-anchor="middle" dominant-baseline="middle">${label}</text>` +
      `</svg>`,
  )}`;
