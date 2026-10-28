import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { Reservation } from "../../types/reservation/reservation";
import { GET_MY_RESERVATIONS } from "../../../apollo/user/query";
import { useMutation, useQuery } from "@apollo/client";
import { T } from "../../types/common";
import { ReserveInquiry } from "../../types/reservation/reservation.input";
import {
  CANCEL_RESERVATION,
  CREATE_REVIEW,
} from "../../../apollo/user/mutation";
import ReservationCard, { ReservationCardSkeleton } from "../common/ReservationCard";
import ListPagination from "../common/ListPagination";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import { ReviewGroup } from "../../enums/review.enum";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";
import { ReviewInput } from "../../types/review/review.input";
import { useTranslation } from "react-i18next";
import { getReservationStart } from "../../utils/reservationDate";

interface MyReservationsProps {
  initialInput?: ReserveInquiry;
  reviewInput?: ReviewInput;
}

type ReservationTab = "all" | "upcoming" | "past";

/** COMMENT: one row of 3 cards per page */
const RESERVATIONS_PER_PAGE = 3;

const TABS: { key: ReservationTab; label: string; empty: string }[] = [
  { key: "all", label: "All", empty: "No reservations found" },
  { key: "upcoming", label: "Upcoming", empty: "No upcoming reservations" },
  { key: "past", label: "Past", empty: "No past reservations" },
];

type SortedReservation = { reservation: Reservation; startMs: number | null; upcoming: boolean };

/** COMMENT: upcoming first (soonest on top), then past (most recent first); no date goes last */
const sortByAppointment = (list: Reservation[], now: number): SortedReservation[] =>
  list
    .map((reservation) => {
      const startMs = getReservationStart(reservation)?.getTime() ?? null;
      return { reservation, startMs, upcoming: startMs !== null && startMs >= now };
    })
    .sort((a, b) => {
      if (a.startMs === null || b.startMs === null) return a.startMs === null ? 1 : -1;
      if (a.upcoming !== b.upcoming) return a.upcoming ? -1 : 1;
      return a.upcoming ? a.startMs - b.startMs : b.startMs - a.startMs;
    });

const MyReservations: FC<MyReservationsProps> = (props) => {
  const { t } = useTranslation("common");
  const {
    // COMMENT: the backend has no date filter/sort, so we load the newest 100 and sort/filter/paginate here
    initialInput = {
      page: 1,
      limit: 100,
      sort: "createdAt",
    },
  } = props;
  const [searchFilter] = useState<ReserveInquiry>(initialInput);
  const [tab, setTab] = useState<ReservationTab>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Apolo request
  const {
    loading: getReservationsLoading,
    data: getReservationsData,
    refetch: getReservationsRefetch,
  } = useQuery(GET_MY_RESERVATIONS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  const reservations: Reservation[] = (getReservationsData as T)?.getMyReservations?.list ?? [];
  const isInitialLoading = getReservationsLoading && !getReservationsData;

  const sorted = useMemo(() => sortByAppointment(reservations, Date.now()), [reservations]);
  const filtered = useMemo(
    () =>
      tab === "all"
        ? sorted
        : sorted.filter((item) => (tab === "upcoming" ? item.upcoming : !item.upcoming)),
    [sorted, tab]
  );

  // COMMENT: filter + sort first, then slice the current page
  const count = filtered.length;
  const totalPages = Math.max(1, Math.ceil(count / RESERVATIONS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * RESERVATIONS_PER_PAGE;
  const visible = filtered.slice(startIndex, startIndex + RESERVATIONS_PER_PAGE);

  // COMMENT: if the current page became empty (e.g. after a cancel/refetch), go back to the last page that has cards
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const [cancelReservation] = useMutation(CANCEL_RESERVATION);

  const [createReview] = useMutation(CREATE_REVIEW);

  const goToPage = (next: number) => {
    if (next < 1 || next > totalPages || next === safePage) return;
    setCurrentPage(next);
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    sectionRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const tabChangeHandler = (next: ReservationTab) => {
    setTab(next);
    setCurrentPage(1);
  };

  const cancelReservationHandler = async (
    reservationId: string,
    cancelReason: string
  ) => {
    if (!reservationId) return;
    await cancelReservation({
      variables: {
        input: {
          reservationId,
          cancelReason: cancelReason,
        },
      },
    });
    await getReservationsRefetch({ input: searchFilter });
  };

  const createReviewHandler = async (reviewInput: ReviewInput) => {
    const {
      reviewContent = "",
      reviewRefId,
      rating,
      reviewGroup = ReviewGroup.MEMBER,
    } = reviewInput;

    try {
      if (!reviewRefId) throw new Error(t("Missing review target"));
      if (!rating || rating <= 0)
        throw new Error(t("Please add a rating before submitting your review"));
      await createReview({
        variables: {
          input: {
            reviewGroup,
            reviewContent: reviewContent.trim(),
            reviewRefId,
            rating,
          },
        },
      });
      await sweetTopSmallSuccessAlert(t("Review submitted!"), 800);
      await getReservationsRefetch({ input: searchFilter });
    } catch (err) {
      await sweetErrorHandling(err);
    }
  };

  const activeTab = TABS.find((x) => x.key === tab) ?? TABS[0];

  return (
    <Stack id="my-reservations" ref={sectionRef}>
      {/* COMMENT: section header = title + count badge + filter tabs */}
      <div className="reservationsHeader">
        <h2 className="reservationsTitle">
          {t("My Reservations")}
          {!isInitialLoading && (
            <span className="countBadge" aria-label={`${count} ${count === 1 ? t("reservation") : t("reservations")}`}>
              {count}
            </span>
          )}
        </h2>

        <div className="filterTabs" role="group" aria-label={t("Filter reservations")}>
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`filterTab ${tab === item.key ? "is-active" : ""}`}
              aria-pressed={tab === item.key}
              onClick={() => tabChangeHandler(item.key)}
            >
              {t(item.label)}
            </button>
          ))}
        </div>
      </div>

      {isInitialLoading ? (
        <div className="reservationGrid" aria-busy="true">
          {Array.from({ length: RESERVATIONS_PER_PAGE }).map((_, i) => (
            <ReservationCardSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="no-data">
          <EventBusyOutlinedIcon className="info-icon" aria-hidden="true" />
          <p>{t(activeTab.empty)}</p>
        </div>
      ) : (
        <div className="reservationGrid">
          {visible.map(({ reservation }) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              onCancel={cancelReservationHandler}
              createReviewHandler={createReviewHandler}
            />
          ))}
        </div>
      )}

      {/* COMMENT: shared pagination (same as the Services page) + "Total N reservations" */}
      {count > 0 && !isInitialLoading && (
        <ListPagination
          page={safePage}
          pageCount={totalPages}
          onChange={goToPage}
          total={count}
          totalLabel={count === 1 ? t("reservation") : t("reservations")}
        />
      )}
    </Stack>
  );
};

export default MyReservations;
