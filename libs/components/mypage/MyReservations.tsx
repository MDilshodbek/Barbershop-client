import React, { FC, useState, ChangeEvent } from "react";
import { Pagination, Stack } from "@mui/material";
import { Reservation } from "../../types/reservation/reservation";
import { GET_MY_RESERVATIONS } from "../../../apollo/user/query";
import { useMutation, useQuery } from "@apollo/client";
import { T } from "../../types/common";
import { ReserveInquiry } from "../../types/reservation/reservation.input";
import {
  CANCEL_RESERVATION,
  CREATE_REVIEW,
} from "../../../apollo/user/mutation";
import ReservationCard from "../common/ReservationCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ReviewGroup } from "../../enums/review.enum";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";
import { Messages } from "../../config";
import { ReviewInput } from "../../types/review/review.input";

interface MyReservationsProps {
  initialInput?: ReserveInquiry;
  reviewInput?: ReviewInput;
}

const MyReservations: FC<MyReservationsProps> = (props) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [total, setTotal] = useState<number>(0);
  const {
    initialInput = {
      page: 1,
      limit: 3,
      sort: "createdAt",
    },
  } = props;
  const [searchFilter, setSearchFilter] =
    useState<ReserveInquiry>(initialInput);

  // Apolo request
  const {
    loading: getReservationsLoading,
    data: getReservationsData,
    error: getReservationsError,
    refetch: getReservationsRefetch,
  } = useQuery(GET_MY_RESERVATIONS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      const list = data?.getMyReservations?.list || [];
      setReservations(list);
      setTotal(data?.getMyReservations?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const [cancelReservation] = useMutation(CANCEL_RESERVATION);

  const [createReview] = useMutation(CREATE_REVIEW);

  const paginationChangeHandler = (_: ChangeEvent<unknown>, value: number) => {
    setSearchFilter((prev) => ({
      ...prev,
      page: value,
    }));
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
      if (!reviewRefId) throw new Error("Missing review target");
      if (!rating || rating <= 0)
        throw new Error("Please add a rating before submitting your review");
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
      await sweetTopSmallSuccessAlert("Review submitted!", 800);
      await getReservationsRefetch({ input: searchFilter });
    } catch (err) {
      await sweetErrorHandling(err);
    }
  };

  return (
    <Stack id="my-reservations">
      <Stack className="main-box">
        {/* COMMENT: empty state */}
        {reservations?.length === 0 ? (
          <div className={"no-data"}>
            <InfoOutlinedIcon className="info-icon" />
            <p>No reservations found</p>
          </div>
        ) : (
          reservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              onCancel={cancelReservationHandler}
              createReviewHandler={createReviewHandler}
            />
          ))
        )}
      </Stack>

      <Stack className={"pagination"}>
        {reservations.length !== 0 &&
          Math.ceil(total / searchFilter.limit) > 1 && (
            <Stack className="pagination-box">
              <Pagination
                page={searchFilter.page ?? 1}
                count={Math.ceil(total / searchFilter.limit)}
                onChange={paginationChangeHandler}
                shape="circular"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#004034", // text color
                    borderColor: "#004034", // border color
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#C6D984", // selected background
                    color: "#fff", // selected text
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "#C6D984", // hover background
                    color: "#fff",
                  },
                }}
              />
            </Stack>
          )}
        {reservations.length !== 0 && (
          <span>
            Total {total} reservation{total > 1 ? "s" : ""}
          </span>
        )}
      </Stack>
    </Stack>
  );
};

export default MyReservations;
