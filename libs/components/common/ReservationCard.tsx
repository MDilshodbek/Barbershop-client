import { FC, useEffect, useState } from "react";
import { Reservation } from "../../types/reservation/reservation";
import { ReserveStatus } from "../../enums/reservation.enum";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { ReviewInput } from "../../types/review/review.input";
import { ReviewGroup } from "../../enums/review.enum";

interface ReservationItemProps {
  reservation: Reservation;
  onCancel: (reservationId: string, cancelReason: string) => Promise<void>;
  createReviewHandler: (reviewInput: ReviewInput) => Promise<void>;
}

const ReservationCard: FC<ReservationItemProps> = ({
  reservation,
  onCancel,
  createReviewHandler,
}) => {
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState("");
  const [cancelReason, setCancelReason] = useState(
    reservation.cancelReason ?? ""
  );
  const [pendingStatus, setPendingStatus] = useState<ReserveStatus | null>(
    null
  );
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const statusMenuOpen = Boolean(statusAnchor);
  const isCancelled = reservation.reserveStatus === ReserveStatus.CANCELLED;

  useEffect(() => {
    setCancelReason(reservation.cancelReason ?? "");
  }, [reservation.cancelReason]);

  const openStatusMenu = (e: ReactMouseEvent<HTMLElement>) => {
    if (isCancelled) return;
    setPendingStatus(null);
    setShowCancelInput(false);
    setStatusAnchor(e.currentTarget);
  };

  const closeStatusMenu = () => {
    setStatusAnchor(null);
  };

  const changeStatus = (nextStatus: ReserveStatus) => {
    closeStatusMenu();
    setPendingStatus(nextStatus);

    if (nextStatus === ReserveStatus.CANCELLED) {
      setReviewOpen(false);
      setShowCancelInput(true);
    } else {
      setShowCancelInput(false);
    }
  };

  const submitReview = async () => {
    if (reviewSubmitting) return;
    if (!reviewRating || reviewRating <= 0) return;
    const reviewRefId =
      reservation.barberId || reservation.reserveRefId;
    if (!reviewRefId) return;

    try {
      setReviewSubmitting(true);
      await createReviewHandler({
        reviewContent: reviewContent.trim(),
        rating: reviewRating,
        reviewRefId,
        reviewGroup: ReviewGroup.MEMBER,
      });

      setReviewRating(0);
      setReviewContent("");
      setReviewOpen(false);
    } catch (error) {
      console.error("Error submitting review", error);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const cancelReasonSubmit = async () => {
    if (pendingStatus !== ReserveStatus.CANCELLED) return;
    const trimmedReason = cancelReason.trim();
    if (!trimmedReason) return;
    await onCancel(reservation._id, trimmedReason);
    setCancelReason("");
    setPendingStatus(null);
    setShowCancelInput(false);
  };

  const createdAtDate = reservation?.createdAt
    ? new Date(reservation.createdAt)
    : null;
  const reserveTimeDate = reservation?.reserveTime
    ? new Date(reservation.reserveTime)
    : null;

  const serviceImage = reservation.serviceData?.serviceImages
    ? `${process.env.REACT_APP_API_URL}/${reservation.serviceData?.serviceImages?.[0]}`
    : "/logo/Logo.svg";

  return (
    <Stack>
      <Box className="reservationCard">
        <Stack className="cardTop">
          <Box className="serviceImage">
            <img src={serviceImage} alt="" />
          </Box>

          <Stack className="cardInfo">
            {/* COMMENT: date + time below service name */}
            <Typography className="dateTime">
              {(createdAtDate
                ? createdAtDate.toLocaleDateString()
                : reservation.createdAt || ""
              ).toString()}
              {" \u2022 "}
              {(reserveTimeDate
                ? reserveTimeDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : reservation.reserveTime || ""
              ).toString()}
            </Typography>
            <Typography className="serviceName">
              {reservation.serviceTitle}
            </Typography>

            {/* COMMENT: barber nick + price */}
            <Stack className="barberRow">
              <Typography className="barberNick">
                {reservation.barberData?.memberNick}
              </Typography>
              <Typography className="price">
                ${reservation.servicePrice}
              </Typography>
              <Typography className="price">
                {reservation.serviceDurationMin}min
              </Typography>
            </Stack>

            {/* COMMENT: status row */}
            <Stack className="statusRow">
              <Typography className="statusText">Status:</Typography>
              <Typography
                className="statusValue"
                onClick={openStatusMenu}
                aria-haspopup={!isCancelled}
                style={{ cursor: isCancelled ? "default" : "pointer" }}
              >
                {pendingStatus ?? reservation.reserveStatus}
              </Typography>
            </Stack>

            {/* COMMENT: right-bottom button: Write Review */}
            <Stack className="actionsRow">
              <Button
                className="reviewBtn"
                onClick={() => !isCancelled && setReviewOpen((p) => !p)}
                disabled={isCancelled}
              >
                Write Review
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Menu
          anchorEl={statusAnchor}
          open={statusMenuOpen}
          onClose={closeStatusMenu}
        >
          <MenuItem onClick={() => changeStatus(ReserveStatus.CANCELLED)}>
            CANCELLED
          </MenuItem>
        </Menu>
      </Box>
      <Box className={showCancelInput || reviewOpen ? "review-box" : "active"}>
        {/* COMMENT: if status becomes CANCELLED, show cancel reason input */}
        {showCancelInput && pendingStatus === ReserveStatus.CANCELLED && (
          <Stack className="cancelBox">
            <Typography className="cancelTitle">Cancellation reason</Typography>
            <textarea
              className="cancelInput"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Write the reason..."
            />
            <Button className="cancelSubmitBtn" onClick={cancelReasonSubmit}>
              Confirm
            </Button>
          </Stack>
        )}

        {/* COMMENT: review input opens under the card */}
        {reviewOpen && reservation.reserveStatus !== ReserveStatus.CANCELLED && (
          <Stack className="reviewBox">
            <Typography className="reviewTitle">Your Rating</Typography>
            <Rating
              value={reviewRating}
              onChange={(_, v) => setReviewRating(v ?? 0)}
              className="ratingStars"
            />

            <Typography className="reviewTitle">Your Review</Typography>
            <textarea
              className="reviewInput"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Write your review..."
            />

            <Button
              className="reviewSubmitBtn"
              onClick={submitReview}
              disabled={
                reviewSubmitting || !reviewRating
              }
            >
              Submit Review
            </Button>
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default ReservationCard;
