import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Link,
  Stack,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { ReserveStatus } from "../../enums/reservation.enum";

type DailyEvent = {
  id: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  name: string;
  userName: string;
  status: ReserveStatus;
  dayKey: string;
};

type WeekDateItem = {
  dayKey: string; // YYYY-MM-DD
  labelDate: string; // "Dec 18"
  labelDay: string; // "Wed"
};

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
      labelDate: `${months[d.getMonth()]} ${d.getDate()}`,
      labelDay: days[d.getDay()],
    });
  }

  return result;
};

type DailyScheduleProps = {
  weekOffset: number;
  schedule: any[];
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

const DailySchedule: FC<DailyScheduleProps> = (props) => {
  const { weekOffset, schedule, updateReservationHandler } = props;
  /** COMMENT: rebuild week list when weekOffset changes */
  const weekDates = useMemo(() => buildWeekDates(weekOffset), [weekOffset]);

  /** COMMENT: map backend reservations into UI events for the visible week */
  const dailyEvents = useMemo<DailyEvent[]>(() => {
    const weekDaySet = new Set(weekDates.map((d) => d.dayKey));

    return (schedule ?? [])
      .map((r: any) => {
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
          name: r?.serviceTitle ?? "Service",
          userName:
            r?.clientData?.memberFullName ??
            r?.clientData?.memberNick ??
            r?.clientData?._id ??
            "Client",
          status: r?.reserveStatus ?? ReserveStatus.BOOKED,
          dayKey,
        } as DailyEvent;
      })
      .filter(Boolean) as DailyEvent[];
  }, [schedule, weekDates]);

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

              return (
                <Button
                  key={d.dayKey}
                  className={`week-date-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveDayIndex(idx)}
                >
                  <span>{d.labelDate}</span>
                  <span>{d.labelDay}</span>
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* COMMENT: RIGHT = original schedule layout (keeps your .main/.events scss) */}
        <Box className="schedule-right">
          <Box component="ul" className="main">
            <Stack component="li" className="events">
              <Stack component="ul" className="events-detail">
                {visibleEvents.length === 0 ? (
                  <Box className="empty-day">No reservations for this day.</Box>
                ) : (
                  visibleEvents.map((event) => (
                    <Stack component="li" key={event.id} className="event-item">
                      {/* COMMENT: left side info */}
                      <Link className="event-link" underline="none">
                        <Stack className="time-box">
                          <Typography component="span" className="event-time">
                            {event.startTime} {"-"}
                          </Typography>
                          <Typography component="span" className="event-time">
                            {event.endTime}
                          </Typography>
                        </Stack>

                        <Typography component="span" className="event-name">
                          {event.name}
                        </Typography>

                        <Typography component="span" className="event-name">
                          {event.userName}
                        </Typography>

                        <Typography component="span" className="event-name">
                          Status: {event.status}
                        </Typography>
                      </Link>

                      {/* COMMENT: right side status button */}
                      <Button
                        className="update-btn"
                        onClick={(e) => openStatusMenu(e, event.id)}
                      >
                        Update
                      </Button>
                    </Stack>
                  ))
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Stack>

      {/* COMMENT: status dropdown menu */}
      <Menu anchorEl={menuAnchor} open={isMenuOpen} onClose={closeStatusMenu}>
        <MenuItem
          onClick={() => changeStatusHandler(ReserveStatus.BOOKED)}
          disabled={activeEvent?.status === ReserveStatus.BOOKED}
        >
          BOOKED
        </MenuItem>
        <MenuItem
          onClick={() => changeStatusHandler(ReserveStatus.CANCELLED)}
          disabled={activeEvent?.status === ReserveStatus.CANCELLED}
        >
          CANCELLED
        </MenuItem>
        <MenuItem
          onClick={() => changeStatusHandler(ReserveStatus.FINISH)}
          disabled={activeEvent?.status === ReserveStatus.FINISH}
        >
          FINISH
        </MenuItem>
        <MenuItem
          onClick={() => changeStatusHandler(ReserveStatus.NOSHOW)}
          disabled={activeEvent?.status === ReserveStatus.NOSHOW}
        >
          NOSHOW
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DailySchedule;
