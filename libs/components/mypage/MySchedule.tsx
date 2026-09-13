import { Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { NextPage } from "next";
import { FC, useState } from "react";
import DailySchedule from "./DailySchedule";
import { Reservations } from "../../types/reservation/reservation";
import { BarberScheduleInquiry } from "../../types/reservation/reservation.input";
import { Direction } from "../../enums/common.enum";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BARBER_SCHEDULES } from "../../../apollo/user/query";
import { UPDATE_RESERVATION } from "../../../apollo/user/mutation";
import { T } from "../../types/common";
import { ReserveStatus } from "../../enums/reservation.enum";
import { useTranslation } from "react-i18next";

interface ScheduleProps {
  initialInput?: BarberScheduleInquiry;
}

const MySchedule: FC<ScheduleProps> = (props) => {
  const { t } = useTranslation("common");
  const [schedule, setSchedule] = useState<Reservations[]>([]);
  const [total, setTotal] = useState<number>(0);
  const {
    initialInput = {
      sort: "daily",
    },
  } = props;
  const [searchFilter, setSearchFilter] =
    useState<BarberScheduleInquiry>(initialInput);

  // Apolo request
  const {
    loading: getBarberSchedulesLoading,
    data: getBarberSchedulesData,
    error: getBarberSchedulesError,
    refetch: getBarberSchedulesRefetch,
  } = useQuery(GET_BARBER_SCHEDULES, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setSchedule(data?.getBarberSchedules?.list || []);
      setTotal(data?.getBarberSchedules?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const [updateReservation] = useMutation(UPDATE_RESERVATION);

  // Handlers
  const updateReservationHandler = async (
    reservationId: string,
    reserveStatus: ReserveStatus
  ) => {
    if (!reservationId) return;
    await updateReservation({
      variables: {
        input: {
          reservationId,
          reserveStatus,
        },
      },
    });
    await getBarberSchedulesRefetch({ input: searchFilter });
  };

  // COMMENT: week pagination (0 = this week, -1 = previous week, +1 = next week)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // COMMENT: move to previous week
  const goPrevWeek = () => setWeekOffset((prev) => prev - 1);

  // COMMENT: move to next week
  const goNextWeek = () => setWeekOffset((prev) => prev + 1);

  // COMMENT: return to current week
  const goThisWeek = () => setWeekOffset(0);

  return (
    <Stack id="mySchedule">
      <Stack className="main-box">
        <Stack className="top">
          <Typography className="title">{t("My Schedules")}</Typography>

          <Stack className="week-pagination">
            {/* COMMENT: active when viewing past weeks */}
            <Button
              className={weekOffset < 0 ? "active" : "week-btn"}
              onClick={goPrevWeek}
            >
              {t("Prev Week")}
            </Button>

            {/* COMMENT: active only for current week */}
            <Button
              className={weekOffset === 0 ? "active" : "week-btn"}
              onClick={goThisWeek}
            >
              {t("This Week")}
            </Button>

            {/* COMMENT: active when viewing future weeks */}
            <Button
              className={weekOffset > 0 ? "active" : "week-btn"}
              onClick={goNextWeek}
            >
              {t("Next Week")}
            </Button>
          </Stack>
        </Stack>

        <Stack className="bottom">
          <DailySchedule
            weekOffset={weekOffset}
            schedule={schedule}
            updateReservationHandler={updateReservationHandler}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MySchedule;
