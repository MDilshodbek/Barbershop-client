"use client";

import { Stack, Typography, Box, Button, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";

import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";

import { Member } from "../../libs/types/member/member";
import { BarbersInquiry } from "../../libs/types/member/member.input";
import { Service } from "../../libs/types/service/service";
import { ServiceInquiry } from "../../libs/types/service/service.input";
import { ReserveInput } from "../../libs/types/reservation/reservation.input";
import { T } from "../../libs/types/common";

import {
  GET_BARBERS,
  GET_SELECTED_BARBER_SCHEDULES,
  GET_SERVICES,
} from "../../apollo/user/query";
import { CREATE_RESERVATION } from "../../apollo/user/mutation";
import { userVar } from "../../apollo/store";

import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { Messages } from "../../libs/config";
import { ServiceStatus } from "../../libs/enums/service.enum";
import { ReserveStatus } from "../../libs/enums/reservation.enum";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

interface AppointmentProps {
  barberInput?: BarbersInquiry;
  serviceInput?: ServiceInquiry;
}

type TimeSlot = {
  time: string;
  label?: string;
  disabled?: boolean;
};

const TIME_SLOTS: TimeSlot[] = [
  { time: "09:00" },
  { time: "09:30" },
  { time: "10:00" },
  { time: "10:30" },
  { time: "11:00" },
  { time: "11:30" },
  { time: "12:00", label: "Lunch Time", disabled: true },
  { time: "13:00" },
  { time: "13:30" },
  { time: "14:00" },
  { time: "14:30" },
  { time: "15:00" },
  { time: "15:30" },
  { time: "16:00" },
  { time: "16:30" },
  { time: "17:00" },
  { time: "17:30" },
  { time: "18:00" },
  { time: "18:30" },
  { time: "19:00" },
];

const timeToMinutes = (time: string): number | null => {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const isoToLocalMinutes = (iso: string | Date): number | null => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.getHours() * 60 + d.getMinutes();
};

const toLocalYmd = (value: string | Date | null | undefined): string | null => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayLocalYmd = () => toLocalYmd(new Date()) ?? "";

const isOverlap = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
) => aStart < bEnd && bStart < aEnd;

const combineYmdAndTime = (ymd: string, time: string): Date | null => {
  const startMin = timeToMinutes(time);
  if (startMin === null) return null;
  const hours = Math.floor(startMin / 60);
  const minutes = startMin % 60;
  const base = new Date(`${ymd}T00:00:00`);
  base.setHours(hours, minutes, 0, 0);
  return base;
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Appointment: NextPage<AppointmentProps> = (props) => {
  const router = useRouter();
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const [barbers, setBarbers] = useState<Member[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(todayLocalYmd());
  const [selectedTime, setSelectedTime] = useState<string | null>(
    TIME_SLOTS[0]?.time ?? null
  );

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Member | null>(null);
  const [reservationNote, setReservationNote] = useState<string>("");

  const [reservedRanges, setReservedRanges] = useState<
    Array<{ startMin: number; endMin: number }>
  >([]);

  const {
    barberInput = { page: 1, limit: 8, sort: "createdAt", search: {} },
    serviceInput = { page: 1, limit: 9, serviceStatus: ServiceStatus.ACTIVE },
  } = props;

  const [searchFilter] = useState<BarbersInquiry>(barberInput);
  const [serviceFilter] = useState<ServiceInquiry>(serviceInput);

  useQuery(GET_BARBERS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBarbers(data?.getBarbers?.list ?? []);
    },
  });

  useQuery(GET_SERVICES, {
    fetchPolicy: "cache-and-network",
    variables: { input: serviceFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setServices(data?.getServices?.list ?? []);
    },
  });

  const [createReservation, { loading: createReservationLoading }] =
    useMutation(CREATE_RESERVATION);

  const [getBarberSchedules, { data: barberSchedulesData }] = useLazyQuery(
    GET_SELECTED_BARBER_SCHEDULES,
    {
      fetchPolicy: "network-only",
      onError: () => {
        setReservedRanges([]);
      },
    }
  );

  useEffect(() => {
    if (services.length && !selectedService) setSelectedService(services[0]);
  }, [services, selectedService]);

  useEffect(() => {
    if (barbers.length && !selectedBarber) setSelectedBarber(barbers[0]);
  }, [barbers, selectedBarber]);

  useEffect(() => {
    if (!selectedBarber?._id || !selectedDate) {
      setReservedRanges([]);
      return;
    }

    getBarberSchedules({
      variables: {
        input: {
          ymd: selectedDate,
          barberId: selectedBarber._id,
        },
      },
    });
  }, [selectedBarber?._id, selectedDate, getBarberSchedules]);

  useEffect(() => {
    const list = barberSchedulesData?.getSelectedBarberSchedules?.list ?? [];
    if (!list.length) {
      setReservedRanges([]);
      return;
    }

    const selectedYmd = selectedDate;

    const ranges = list
      .filter((r: any) => r.reserveStatus !== ReserveStatus.CANCELLED)
      .map((r: any) => {
        const startMin = isoToLocalMinutes(r.reserveTime);
        const endMinRaw = isoToLocalMinutes(r.reserveEndTime);
        const durationMin = r?.serviceDurationMin ?? r?.serviceDuration ?? 30;

        const endMin =
          endMinRaw ?? (startMin !== null ? startMin + durationMin : null);

        const reserveYmd =
          toLocalYmd(r?.reserveTime) ??
          toLocalYmd(r?.reserveDay) ??
          toLocalYmd(r?.reserveEndTime) ??
          null;

        const include =
          (!reserveYmd || reserveYmd === selectedYmd) &&
          startMin !== null &&
          endMin !== null &&
          endMin > startMin;

        if (!include) return null;
        return { startMin, endMin };
      })
      .filter(Boolean) as Array<{ startMin: number; endMin: number }>;

    setReservedRanges(ranges);
  }, [barberSchedulesData, selectedDate]);

  useEffect(() => {
    if (!selectedTime) return;
    const startMin = timeToMinutes(selectedTime);
    if (startMin === null) return;

    const durationMin =
      (selectedService as any)?.serviceDurationMin ??
      (selectedService as any)?.serviceDuration ??
      30;

    const endMin = startMin + durationMin;

    const invalid = reservedRanges.some((rr) =>
      isOverlap(startMin, endMin, rr.startMin, rr.endMin)
    );

    if (invalid) setSelectedTime(null);
  }, [reservedRanges, selectedTime, selectedService]);

  const selectedDurationMin = useMemo(() => {
    return (
      (selectedService as any)?.serviceDurationMin ??
      (selectedService as any)?.serviceDuration ??
      30
    );
  }, [selectedService]);

  const totalPrice = selectedService?.servicePrice
    ? `$${selectedService.servicePrice.toFixed(2)}`
    : "$0.00";

  const makeAppointmentDisabled =
    createReservationLoading ||
    !selectedService ||
    !selectedDate ||
    !selectedTime;

  const handleCreateReservation = async () => {
    try {
      if (!user?._id) throw new Error(Messages.error2);
      if (!selectedService?._id) throw new Error("Please select a service.");
      if (!selectedBarber?._id) throw new Error("Please select a barber.");
      if (!selectedDate) throw new Error("Please select a date.");
      if (!selectedTime) throw new Error("Please select a time slot.");

      const reserveTime = combineYmdAndTime(selectedDate, selectedTime);
      if (!reserveTime) throw new Error("Invalid time slot.");

      const reserveDay = new Date(`${selectedDate}T00:00:00`);

      const reserveInput: ReserveInput = {
        serviceId: selectedService._id,
        barberId: selectedBarber._id,
        reserveDay,
        reserveTime,
      };

      const trimmedNote = reservationNote.trim();
      if (trimmedNote) reserveInput.reserveNotes = trimmedNote;

      await createReservation({ variables: { input: reserveInput } });

      await sweetTopSmallSuccessAlert("Reservation created!", 1200);
      await router.push({
        pathname: "/mypage",
        query: { category: "myReservations" },
      });
    } catch (err) {
      await sweetErrorHandling(err);
    }
  };

  if (device === "mobile") return <Stack>Appointment Page mobile</Stack>;

  return (
    <Stack className="appointment-page">
      <Typography className="hero-title">{t("Appointment")}</Typography>

      <Stack className="container">
        <Stack className="appoint-main">
          <Stack className="reservation">
            <Typography className="appoint-title">
              Make Your Cropper Reservation
            </Typography>
            <Typography className="appoint-subtitle">
              Step into an elevated grooming experience tailored just for you.
              Our master barbers await to craft your signature look.
            </Typography>

            <Stack className="inputs-main">
              <Box className="appointment-frame">
                <Stack
                  className="service-barber-section"
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: 4, md: 6 }}
                >
                  <Box className="step-block">
                    <Typography className="step-title">
                      01. Select Service
                    </Typography>

                    <Autocomplete
                      className="autocomplete-input"
                      options={services}
                      value={selectedService}
                      onChange={(_, value) => setSelectedService(value)}
                      getOptionLabel={(option) =>
                        option?.serviceTitle ?? "Choose a service"
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?._id === value?._id
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>
                          {option.serviceTitle} - ${option.servicePrice}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Choose a service"
                        />
                      )}
                    />
                  </Box>

                  <Box className="step-block">
                    <Typography className="step-title">
                      02. Select Barber
                    </Typography>

                    <Autocomplete
                      className="autocomplete-input"
                      options={barbers}
                      value={selectedBarber}
                      onChange={(_, value) => setSelectedBarber(value)}
                      getOptionLabel={(option) =>
                        option?.memberFullName ||
                        option?.memberNick ||
                        "Choose a barber"
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?._id === value?._id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Choose a barber"
                        />
                      )}
                    />
                  </Box>
                </Stack>

                <Stack
                  className="appointment-top"
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: 4, md: 10 }}
                >
                  <Box className="date-section">
                    <Typography className="step-title">
                      03. Select Date
                    </Typography>

                    <TextField
                      className="date-input"
                      type="date"
                      variant="outlined"
                      fullWidth
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>

                  <Box className="time-section">
                    <Typography className="step-title">
                      04. Select Time
                    </Typography>

                    <Box className="time-grid">
                      {TIME_SLOTS.map((slot) => {
                        const slotStartMin = timeToMinutes(slot.time);
                        const candidateStart = slotStartMin ?? -1;
                        const candidateEnd =
                          slotStartMin !== null
                            ? slotStartMin + selectedDurationMin
                            : -1;

                        const isDisabled =
                          !!slot.disabled ||
                          slotStartMin === null ||
                          reservedRanges.some((rr) =>
                            isOverlap(
                              candidateStart,
                              candidateEnd,
                              rr.startMin,
                              rr.endMin
                            )
                          );

                        return (
                          <Button
                            key={slot.time}
                            onClick={() => setSelectedTime(slot.time)}
                            disabled={isDisabled}
                            variant={
                              selectedTime === slot.time
                                ? "contained"
                                : "outlined"
                            }
                            className={[
                              "time-chip",
                              selectedTime === slot.time &&
                                "time-chip--selected",
                              isDisabled && "time-chip--disabled",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {slot.label
                              ? `${slot.time} (${slot.label})`
                              : slot.time}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                </Stack>

                <Stack className="notes-top">
                  <Box className="note-section">
                    <Typography className="step-title">
                      05. Leave Notes
                    </Typography>

                    <Box className="notes-input">
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        placeholder="Share any preferences or requests for your appointment"
                        value={reservationNote}
                        onChange={(e) => setReservationNote(e.target.value)}
                      />
                    </Box>
                  </Box>
                </Stack>

                <Stack
                  className="total-row"
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={{ xs: 4, md: 0 }}
                >
                  <Box className="total-box">
                    <Typography className="total-label">TOTAL</Typography>
                    <Typography className="total-value">
                      {totalPrice}
                    </Typography>
                  </Box>

                  <Button
                    className="submit-button"
                    variant="contained"
                    size="large"
                    disabled={makeAppointmentDisabled}
                    onClick={handleCreateReservation}
                  >
                    MAKE AN APPOINTMENT
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Appointment);
