import { Reservation } from "../types/reservation/reservation";

type DateValue = string | number | Date | null | undefined;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Converts a backend date value to a local Date.
 * Date-only strings ("2026-11-10") are read as that calendar day in local time,
 * because new Date("2026-11-10") is parsed as UTC and can shift to the previous day.
 * Full ISO datetimes are converted to local time (same as DailySchedule does).
 */
export const toLocalDate = (value: DateValue): Date | null => {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "string") {
    const match = DATE_ONLY.exec(value.trim());
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Local date in the card's existing format (toLocaleDateString, e.g. "10/27/2026") */
export const formatLocalDate = (value: DateValue): string =>
  toLocalDate(value)?.toLocaleDateString() ?? "";

/** Local time in the card's existing format (e.g. "02:30 PM") */
export const formatLocalTime = (value: DateValue): string =>
  toLocalDate(value)?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "";

/**
 * "date • time" of the reserved appointment.
 * reserveTime is the full appointment start, so it gives both the date and the time;
 * reserveDay (the appointment day) is the fallback for the date.
 */
export const formatReservationDateTime = (
  reservation: Pick<Reservation, "reserveTime" | "reserveDay">
): string => {
  const date = formatLocalDate(reservation?.reserveTime) || formatLocalDate(reservation?.reserveDay);
  const time = formatLocalTime(reservation?.reserveTime);
  return [date, time].filter(Boolean).join(" • ");
};

/** App language code -> Intl locale */
const INTL_LOCALES: Record<string, string> = { en: "en-US", kr: "ko-KR", ru: "ru-RU", cn: "zh-CN" };
export const toIntlLocale = (language?: string): string => INTL_LOCALES[language ?? ""] ?? "en-US";

/** Friendly local date, e.g. "Tue, Nov 10, 2026" */
export const formatFriendlyDate = (value: DateValue, locale: string, withWeekday = true): string => {
  const date = toLocalDate(value);
  if (!date) return "";
  return date.toLocaleDateString(locale, {
    ...(withWeekday ? { weekday: "short" as const } : {}),
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/** Friendly local time, e.g. "2:30 PM" */
export const formatFriendlyTime = (value: DateValue, locale: string): string =>
  toLocalDate(value)?.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" }) ?? "";

/** Appointment start as a local Date (reserveTime, falling back to reserveDay) */
export const getReservationStart = (
  reservation: Pick<Reservation, "reserveTime" | "reserveDay">
): Date | null => toLocalDate(reservation?.reserveTime) ?? toLocalDate(reservation?.reserveDay);

/** True when the appointment start is still ahead of now */
export const isUpcomingReservation = (
  reservation: Pick<Reservation, "reserveTime" | "reserveDay">,
  now: number = Date.now()
): boolean => {
  const start = getReservationStart(reservation);
  return !!start && start.getTime() >= now;
};
