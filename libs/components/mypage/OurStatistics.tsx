import React, { FC, useMemo, useState } from "react";
import {
  Alert,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@apollo/client";
import { GET_SELECTED_BARBER_SCHEDULES } from "../../../apollo/user/query";
import {
  AllBarberScheduleInquiry,
  SelectedBarberScheduleInquiry,
} from "../../types/reservation/reservation.input";
import { Reservation } from "../../types/reservation/reservation";
import { ReserveStatus } from "../../enums/reservation.enum";
import { GET_ALL_BARBER_SCHEDULES_BY_ADMIN } from "../../../apollo/admin/query";
import { T } from "../../types/common";

interface BarberStatisticsProps {
  initialInput?: AllBarberScheduleInquiry;
  baseInput?: SelectedBarberScheduleInquiry;
}

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const PIE_COLORS: Record<string, string> = {
  [ReserveStatus.BOOKED]: "#004034",
  [ReserveStatus.CANCELLED]: "#f57c00",
  [ReserveStatus.NOSHOW]: "#b23b3b",
  [ReserveStatus.FINISH]: "#c6d984",
};

export const OurStatistics: FC<BarberStatisticsProps> = (props) => {
  const [selectedBarber, setSelectedBarber] = useState<string>("ALL");
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [selectedBarberStats, setSelectedBarberStats] = useState<Reservation[]>(
    []
  );
  const {
    initialInput = {
      sort: "createdAt",
    },
    baseInput = {
      sort: "createdAt",
      barberId: "",
    },
  } = props;
  const [allReservationsInquiry] =
    useState<AllBarberScheduleInquiry>(initialInput);

  const [baseInquiry, setBaseInquiry] =
    useState<SelectedBarberScheduleInquiry>(baseInput);

  const {
    loading: getAllBarberSchedulesLoading,
    error: getAllBarberSchedulesError,
    refetch: refetchAllBarberSchedules,
  } = useQuery(GET_ALL_BARBER_SCHEDULES_BY_ADMIN, {
    variables: { input: allReservationsInquiry },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setAllReservations(data?.getAllBarberSchedules?.list || []);
    },
  });

  const {
    loading: getSelectedBarberSchedulesLoading,
    error: getSelectedBarberSchedulesError,
    refetch: refetchSelectedBarberSchedules,
  } = useQuery(GET_SELECTED_BARBER_SCHEDULES, {
    variables: { input: baseInquiry },
    skip: selectedBarber === "ALL" || !baseInquiry?.barberId,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setSelectedBarberStats(data?.getSelectedBarberSchedules?.list || []);
    },
  });

  const isLoading = getAllBarberSchedulesLoading || getSelectedBarberSchedulesLoading;
  const queryError = getAllBarberSchedulesError || getSelectedBarberSchedulesError;

  const activeReservations = useMemo(
    () => (selectedBarber === "ALL" ? allReservations : selectedBarberStats),
    [allReservations, selectedBarber, selectedBarberStats]
  );

  const barberOptions = useMemo(() => {
    const map = new Map<string, string>();
    allReservations.forEach((item) => {
      if (!item.barberId) return;
      if (map.has(item.barberId)) return;

      const name =
        item.barberData?.memberFullName ||
        item.barberData?.memberNick ||
        item.barberId;

      map.set(item.barberId, name);
    });

    return [
      { value: "ALL", label: "All" },
      ...Array.from(map.entries()).map(([value, label]) => ({
        value,
        label,
      })),
    ];
  }, [allReservations]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      [ReserveStatus.BOOKED]: 0,
      [ReserveStatus.CANCELLED]: 0,
      [ReserveStatus.NOSHOW]: 0,
      [ReserveStatus.FINISH]: 0,
    };

    activeReservations.forEach((item) => {
      if (counts[item.reserveStatus] === undefined) return;
      counts[item.reserveStatus] += 1;
    });

    return [
      { name: "Booked", value: counts[ReserveStatus.BOOKED] },
      { name: "Cancelled", value: counts[ReserveStatus.CANCELLED] },
      { name: "NoShow", value: counts[ReserveStatus.NOSHOW] },
      { name: "Finish", value: counts[ReserveStatus.FINISH] },
    ];
  }, [activeReservations]);

  const totalReservations = activeReservations.length;

  const revenueStats = useMemo(
    () =>
      activeReservations.reduce(
        (acc, item) => {
          const price = item.servicePrice || 0;
          if (item.reserveStatus === ReserveStatus.FINISH) {
            acc.finish += price;
          } else if (item.reserveStatus === ReserveStatus.BOOKED) {
            acc.booked += price;
          }
          return acc;
        },
        { finish: 0, booked: 0 }
      ),
    [activeReservations]
  );

  const revenueChartData = useMemo(
    () => [
      { label: "Finish", revenue: revenueStats.finish },
      { label: "Booked", revenue: revenueStats.booked },
    ],
    [revenueStats]
  );

  const totalRevenue = revenueStats.finish;

  const handleBarberChange = async (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedBarber(value);

    if (value === "ALL") {
      setBaseInquiry({ ...baseInput, barberId: "" });
      setSelectedBarberStats([]);
      await refetchAllBarberSchedules({ input: allReservationsInquiry });
      return;
    }

    const nextInput = { ...baseInquiry, barberId: value };
    setBaseInquiry(nextInput);
    await refetchSelectedBarberSchedules({ input: nextInput });
  };

  const renderCharts = () => {
    if (queryError) {
      return (
        <Alert severity="error">
          Failed to load statistics. Please try again.
        </Alert>
      );
    }

    if (isLoading) {
      return (
        <Stack spacing={2} className="statistics-skeleton">
          <Skeleton variant="rounded" height={300} />
          <Skeleton variant="rounded" height={300} />
        </Stack>
      );
    }

    if (!activeReservations.length) {
      return (
        <Stack className="statistics-empty">
          <Typography>No statistics available for this selection.</Typography>
        </Stack>
      );
    }

    return (
      <Stack className="charts-stack">
        <Stack className="chart-card">
          <Stack className="chart-header">
            <Typography className="chart-title">Reservation Status</Typography>
            <Typography className="chart-subtitle">
              Total Reservations: {totalReservations}
            </Typography>
          </Stack>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={2}
                label={({ percent }) => {
                  const safePercent =
                    typeof percent === "number" && Number.isFinite(percent)
                      ? percent
                      : 0;
                  return `${Math.round(safePercent * 100)}%`;
                }}
                labelLine={false}
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      PIE_COLORS[
                        [
                          ReserveStatus.BOOKED,
                          ReserveStatus.CANCELLED,
                          ReserveStatus.NOSHOW,
                          ReserveStatus.FINISH,
                        ][index]
                      ] || "#004034"
                    }
                  />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: any, name: any) => {
                  const percent = totalReservations
                    ? Math.round(((value as number) / totalReservations) * 100)
                    : 0;
                  return [`${value} (${percent}%)`, name as string];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Stack>

        <Stack className="chart-card">
          <Stack className="chart-header">
            <Typography className="chart-title">Revenue</Typography>
            <Typography className="chart-subtitle">
              Total Revenue: {CURRENCY.format(totalRevenue)}
            </Typography>
          </Stack>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueChartData} maxBarSize={64}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" />
              <YAxis
                tickFormatter={(value) => CURRENCY.format(value as number)}
              />
              <RechartsTooltip
                formatter={(value: any) => CURRENCY.format(value as number)}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#004034"
                radius={[8, 8, 0, 0]}
                name="Revenue by status"
              />
            </BarChart>
          </ResponsiveContainer>
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack className="statistics-board">
      <Typography className="tit">Statistics</Typography>
      <Stack className="card filters-card">
        <Stack className="filter-row">
          <Select
            value={selectedBarber}
            onChange={handleBarberChange}
            className="filter-barber"
          >
            {barberOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      <Box className="card">
        <Stack className="charts-wrapper">{renderCharts()}</Stack>
      </Box>
    </Stack>
  );
};
