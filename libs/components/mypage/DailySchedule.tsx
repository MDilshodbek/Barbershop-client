import React, { FC, useEffect, useMemo, useState } from "react";
import { Box, Stack, Button, Menu, MenuItem } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { ReserveStatus } from "../../enums/reservation.enum";
import { Reservation } from "../../types/reservation/reservation";
import { useTranslation } from "react-i18next";
import ExpandableNote from "../common/ExpandableNote";

type DailyEvent = {
  id: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  name: string;
  userName: string;
  status: ReserveStatus;
  dayKey: string;
  notes: string | null; // COMMENT: trimmed client note, null when empty
};

type WeekDateItem = {
  dayKey: string; // YYYY-MM-DD
  monthAbbr: string; // "Dec"
  dayNum: number; // 18
  labelDay: string; // "Wed"
};

/** COMMENT: CSS modifier per status (pill colors + accent bar) */
const STATUS_CLASS: Record<ReserveStatus, string> = {
  [ReserveStatus.BOOKED]: "booked",
  [ReserveStatus.FINISH]: "finished",
  [ReserveStatus.CANCELLED]: "cancelled",
  [ReserveStatus.NOSHOW]: "no-show",
};

/** COMMENT: cancelled and no-show cards are faded so active bookings stand out */
const INACTIVE_STATUSES = new Set<ReserveStatus>([
  ReserveStatus.CANCELLED,
  ReserveStatus.NOSHOW,
]);

/** COMMENT: build week dates by weekOffset (0=this week, -1=prev week, +1=next week) */
const buildWeekDates = (weekOffset: number): WeekDateItem[] => {
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  // COMMENT: shift by 7 * offset days from today (simple week pagination)
  base.setDate(base.getDate() + weekOffset * 7);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const result: WeekDateItem[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const dayKey = `${yyyy}-${mm}-${dd}`;

    result.push({
      dayKey,
      monthAbbr: months[d.getMonth()],
      dayNum: d.getDate(),
      labelDay: days[d.getDay()],
    });
  }

  return result;
};

type DailyScheduleProps = {
  weekOffset: number;
  schedule: Reservation[];
  updateReservationHandler: (
    reservationId: string,
    reserveStatus: ReserveStatus
  ) => Promise<void>;
};

/** COMMENT: ISO -> local yyyy-mm-dd */
const toLocalYmd = (iso: string | Date | null | undefined) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** COMMENT: ISO -> local HH:MM am/pm */
const toLocalTime = (iso: string | Date | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/** COMMENT: ISO start + duration -> end ISO */
const addMinutes = (iso: string | Date, minutes: number) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setMinutes(d.getMinutes() + minutes);
  return d;
};

/** COMMENT: ISO -> minutes from start of day (local) */
const isoToLocalMinutes = (iso: string | Date | null | undefined) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.getHours() * 60 + d.getMinutes();
};

/** COMMENT: trimmed note text, or null when missing/blank */
const normalizeNotes = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const DailySchedule: FC<DailyScheduleProps> = (props) => {
  const { t } = useTranslation("common");
  const { weekOffset, schedule, updateReservationHandler } = props;
  /** COMMENT: rebuild week list when weekOffset changes */
  const weekDates = useMemo(() => buildWeekDates(weekOffset), [weekOffset]);

  /** COMMENT: map backend reservations into UI events for the visible week */
  const dailyEvents = useMemo<DailyEvent[]>(() => {
    const weekDaySet = new Set(weekDates.map((d) => d.dayKey));

    return (schedule ?? [])
      .map((r) => {
        const dayKey =
          toLocalYmd(r?.reserveTime) ??
          toLocalYmd(r?.reserveDay) ??
          toLocalYmd(r?.reserveEndTime);

        if (!dayKey || !weekDaySet.has(dayKey)) return null;

        const startIso = r?.reserveTime;
        const endIso =
          r?.reserveEndTime ??
          addMinutes(startIso, r?.serviceDurationMin ?? 30);
        const startMinutes = isoToLocalMinutes(startIso);

        return {
          id: r?._id,
          startTime: toLocalTime(startIso),
          endTime: toLocalTime(endIso),
          startMinutes: startMinutes ?? 0,
          name: r?.serviceTitle ?? t("Service"),
          userName:
            r?.clientData?.memberFullName ??
            r?.clientData?.memberNick ??
            r?.clientData?._id ??
            t("Client"),
          status: r?.reserveStatus ?? ReserveStatus.BOOKED,
          dayKey,
          notes: normalizeNotes(r?.reserveNotes),
        } as DailyEvent;
      })
      .filter(Boolean) as DailyEvent[];
  }, [schedule, weekDates, t]);

  /** COMMENT: days in this week that have at least one client note (dot on the date button) */
  const daysWithNotes = useMemo(
    () => new Set(dailyEvents.filter((e) => e.notes).map((e) => e.dayKey)),
    [dailyEvents]
  );

  /** COMMENT: selected day index inside the current week */
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  /** COMMENT: tracks which event’s status menu is open */
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const isMenuOpen = Boolean(menuAnchor);

  /** COMMENT: protect from out-of-range if something changes */
  const safeActiveDayIndex = Math.min(
    Math.max(activeDayIndex, 0),
    weekDates.length - 1
  );

  const activeDay = weekDates[safeActiveDayIndex];

  /** COMMENT: when week changes, reset selected day */
  useEffect(() => {
    setActiveDayIndex(0);
    // COMMENT: close menu if week changes
    setMenuAnchor(null);
    setActiveEventId(null);
  }, [weekDates]);

  /** COMMENT: only show events for the selected day */
  const visibleEvents = useMemo(() => {
    return dailyEvents
      .filter((e) => e.dayKey === activeDay.dayKey)
      .sort((a, b) => a.startMinutes - b.startMinutes);
  }, [dailyEvents, activeDay.dayKey]);

  const activeEvent = useMemo(() => {
    if (!activeEventId) return null;
    return dailyEvents.find((e) => e.id === activeEventId) ?? null;
  }, [activeEventId, dailyEvents]);

  /** COMMENT: open status menu for a specific reservation */
  const openStatusMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setMenuAnchor(e.currentTarget);
    setActiveEventId(id);
  };

  /** COMMENT: close menu */
  const closeStatusMenu = () => {
    setMenuAnchor(null);
    setActiveEventId(null);
  };

  /** COMMENT: update status via parent handler */
  const changeStatusHandler = async (nextStatus: ReserveStatus) => {
    if (!activeEventId) return;
    await updateReservationHandler(activeEventId, nextStatus);
    closeStatusMenu();
  };

  return (
    <Box className="dailySchedule">
      {/* COMMENT: layout wrapper (left week list + right day details) */}
      <Stack className="schedule-layout">
        {/* COMMENT: LEFT = clickable weekly dates (NO scroll/spin) */}
        <Box className="week-dates">
          <Stack className="week-dates-inner">
            {weekDates.map((d, idx) => {
              const isActive = idx === safeActiveDayIndex;
              const hasNotes = daysWithNotes.has(d.dayKey);

              return (
                <Button
                  key={d.dayKey}
                  className={`week-date-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveDayIndex(idx)}
                >
                  <span>{t(d.monthAbbr)} {d.dayNum}</span>
                  <span>{t(d.labelDay)}</span>
                  {hasNotes && (
                    <>
                      <span className="note-dot" aria-hidden="true" />
                      <span className="visually-hidden">{t("Has client notes")}</span>
                    </>
                  )}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* COMMENT: RIGHT = selected day's appointment cards */}
        <Box className="schedule-right">
          <Box component="ul" className="main">
            <Stack component="li" className="events">
              <Stack component="ul" className="events-detail">
                {visibleEvents.length === 0 ? (
                  <Box className="empty-day">{t("No reservations for this day.")}</Box>
                ) : (
                  visibleEvents.map((event) => {
                    const statusClass = STATUS_CLASS[event.status] ?? "booked";
                    const isInactive = INACTIVE_STATUSES.has(event.status);
                    const initial = event.userName.trim().charAt(0).toUpperCase() || "?";

                    return (
                      <li
                        key={event.id}
                        className={`event-card status-${statusClass} ${isInactive ? "is-inactive" : ""}`}
                      >
                        {/* COMMENT: top row = time range, status pill, Update button */}
                        <div className="event-top">
                          <span className="event-time">
                            <AccessTimeRoundedIcon className="event-time-icon" aria-hidden="true" />
                            <span>
                              {event.startTime} – {event.endTime}
                            </span>
                          </span>

                          <span className="status-pill">
                            <span className="visually-hidden">{t("Status:")} </span>
                            {t(event.status)}
                          </span>

                          <Button
                            className="update-btn"
                            aria-haspopup="menu"
                            aria-expanded={isMenuOpen && activeEventId === event.id}
                            onClick={(e) => openStatusMenu(e, event.id)}
                          >
                            {t("Update")}
                          </Button>
                        </div>

                        {/* COMMENT: middle row = service + client */}
                        <div className="event-meta">
                          <span className="event-service">
                            <ContentCutRoundedIcon className="event-service-icon" aria-hidden="true" />
                            <span>{event.name}</span>
                          </span>

                          <span className="event-client">
                            <span className="client-avatar" aria-hidden="true">
                              {initial}
                            </span>
                            <span>{event.userName}</span>
                          </span>
                        </div>

                        {/* COMMENT: client note (plain text) or a muted placeholder */}
                        <div className="event-notes">
                          {event.notes ? (
                            <ExpandableNote
                              note={event.notes}
                              label={t("Client note")}
                              icon={<FormatQuoteRoundedIcon className="note-icon" aria-hidden="true" />}
                            />
                          ) : (
                            <p className="note-empty">{t("No notes from client")}</p>
                          )}
                        </div>
                      </li>
                    );
                  })
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Stack>

      {/* COMMENT: status dropdown menu (MUI portal, renders above all cards) */}
      <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={closeStatusMenu}>
        <MenuItem
          onClick={() => changeStatusHandler(ReserveStatus.BOOKED)}
          disabled={activeEvent?.status === ReserveStatus.BOOKED}
        >
          {t(ReserveStatus.BOOKED)}
        </MenuItem>
        <MenuItem
          onClick={() => changeStatusHandler(ReserveStatus.CANCELLED)}
          disabled={activeEvent?.status === ReserveStatus.CANCELLED}
        >
          {t(ReserveStatus.CANCELLED)}
        </MenuItem>
        <MenuItem
          onClick={() => changeStatusHandler(ReserveStatus.FINISH)}
          disabled={activeEvent?.status === ReserveStatus.FINISH}
        >
          {t(ReserveStatus.FINISH)}
        </MenuItem>
        <MenuItem
          onClick={() => changeStatusHandler(ReserveStatus.NOSHOW)}
          disabled={activeEvent?.status === ReserveStatus.NOSHOW}
        >
          {t(ReserveStatus.NOSHOW)}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DailySchedule;
