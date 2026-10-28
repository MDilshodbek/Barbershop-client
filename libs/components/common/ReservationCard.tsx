import { FC, MouseEvent, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Reservation } from "../../types/reservation/reservation";
import { ReserveStatus } from "../../enums/reservation.enum";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  Menu,
  MenuItem,
  Rating,
  Skeleton,
  Tooltip,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import { ReviewInput } from "../../types/review/review.input";
import { ReviewGroup } from "../../enums/review.enum";
import { useTranslation } from "react-i18next";
import {
  formatFriendlyDate,
  formatFriendlyTime,
  getReservationStart,
  toIntlLocale,
} from "../../utils/reservationDate";
import { getImageUrl } from "../../utils/imageUrl";

interface ReservationItemProps {
  reservation: Reservation;
  onCancel: (reservationId: string, cancelReason: string) => Promise<void>;
  createReviewHandler: (reviewInput: ReviewInput) => Promise<void>;
}

const FALLBACK_IMAGE = "/logo/Logo.svg";

/** COMMENT: color modifier + label key per status (used by the image pill and the status row) */
const STATUS_META: Record<ReserveStatus, { className: string; label: string }> = {
  [ReserveStatus.BOOKED]: { className: "booked", label: "Booked" },
  [ReserveStatus.FINISH]: { className: "completed", label: "Completed" },
  [ReserveStatus.CANCELLED]: { className: "cancelled", label: "Cancelled" },
  [ReserveStatus.NOSHOW]: { className: "no-show", label: "No-show" },
};

const hasReviewMeta = (reservation: Reservation) =>
  Boolean(
    (reservation as any)?.reviewId ||
      (reservation as any)?.reviewed ||
      (reservation as any)?.hasReview
  );

const ReservationCard: FC<ReservationItemProps> = ({
  reservation,
  onCancel,
  createReviewHandler,
}) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const locale = toIntlLocale(i18n?.language);
  const uid = useId();
  const menuId = `status-menu-${uid}`;
  const noteId = `note-${uid}`;
  const reviewId = `review-${uid}`;

  const [reviewOpen, setReviewOpen] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState<boolean>(() =>
    hasReviewMeta(reservation)
  );
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [cancelReason, setCancelReason] = useState(reservation.cancelReason ?? "");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(menuAnchor);

  // COMMENT: image loading state (skeleton until loaded, logo on error)
  const imageSrc =
    getImageUrl(reservation.serviceData?.serviceImages?.[0]) || FALLBACK_IMAGE;
  const [imgSrc, setImgSrc] = useState(imageSrc);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgSrc(imageSrc);
    setImgLoaded(false);
  }, [imageSrc]);

  useEffect(() => {
    // COMMENT: a cached image can finish before React attaches onLoad
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setImgLoaded(true);
  }, [imgSrc]);

  // COMMENT: reset the card's own state when the reservation changes
  useEffect(() => {
    setCancelReason(reservation.cancelReason ?? "");
    setHasSubmittedReview(hasReviewMeta(reservation));
    setReviewOpen(false);
    setReviewRating(0);
    setReviewContent("");
    setCancelDialogOpen(false);
    setMenuAnchor(null);
  }, [reservation._id, reservation.reserveStatus, reservation.cancelReason]);

  const status = reservation.reserveStatus;
  const statusMeta = STATUS_META[status] ?? STATUS_META[ReserveStatus.BOOKED];
  const isBooked = status === ReserveStatus.BOOKED;
  const isFinished = status === ReserveStatus.FINISH;
  const canWriteReview = isFinished && !hasSubmittedReview;

  const start = getReservationStart(reservation);
  const isUpcoming = !!start && start.getTime() >= Date.now();

  const dateLabel = formatFriendlyDate(start, locale);
  const timeLabel = formatFriendlyTime(reservation.reserveTime, locale);
  const bookedOnLabel = formatFriendlyDate(reservation.createdAt, locale, false);
  const reserveNotes = reservation?.reserveNotes?.toString().trim();

  const barberName =
    reservation.barberData?.memberNick || reservation.barberData?.memberFullName || "";
  const barberImage = getImageUrl(reservation.barberData?.memberImage);
  const barberInitial = barberName.trim().charAt(0).toUpperCase() || "?";
  const serviceTitle = reservation.serviceTitle || t("Service");
  const barberId = reservation.barberId || reservation.barberData?._id;

  /** COMMENT: hint shown as a tooltip on the status value */
  const statusHint = isBooked
    ? isUpcoming
      ? t("You can review after your appointment")
      : t("Waiting for barber to mark as completed")
    : "";

  // ===== status menu =====
  const openMenu = (e: MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const contactBarber = () => {
    closeMenu();
    if (!barberId) return;
    router.push({ pathname: "/barber/detail", query: { barberId } });
  };

  const bookAgain = () => {
    closeMenu();
    const query: Record<string, string> = {};
    if (reservation.serviceId) query.serviceId = reservation.serviceId;
    if (barberId) query.barberId = barberId;
    router.push({ pathname: "/appointment", query });
  };

  const startReview = () => {
    closeMenu();
    setReviewOpen(true);
  };

  const askCancel = () => {
    closeMenu();
    setCancelDialogOpen(true);
  };

  // ===== review =====
  const submitReview = async () => {
    if (hasSubmittedReview) return;
    if (reviewSubmitting) return;
    if (!reviewRating || reviewRating <= 0) return;
    const reviewRefId = reservation.barberId || reservation.reserveRefId;
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
      setHasSubmittedReview(true);
    } catch (error) {
      console.error("Error submitting review", error);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ===== cancel =====
  const closeCancelDialog = () => {
    if (cancelSubmitting) return;
    setCancelDialogOpen(false);
  };

  const confirmCancel = async () => {
    if (cancelSubmitting) return;
    try {
      setCancelSubmitting(true);
      await onCancel(reservation._id, cancelReason.trim());
      setCancelReason("");
      setCancelDialogOpen(false);
    } finally {
      setCancelSubmitting(false);
    }
  };

  /** COMMENT: context actions for the status dropdown */
  const menuItems = (() => {
    const items: JSX.Element[] = [];

    if (isBooked && !isUpcoming) {
      items.push(
        <MenuItem key="waiting" disabled className="statusMenuInfo">
          <ListItemIcon>
            <HourglassEmptyRoundedIcon fontSize="small" />
          </ListItemIcon>
          {t("Waiting for barber to mark as completed")}
        </MenuItem>
      );
    }

    if (isFinished) {
      items.push(
        canWriteReview ? (
          <MenuItem key="review" onClick={startReview}>
            <ListItemIcon>
              <StarRoundedIcon fontSize="small" />
            </ListItemIcon>
            {t("Write Review")}
          </MenuItem>
        ) : (
          <MenuItem key="reviewed" disabled className="statusMenuInfo">
            <ListItemIcon>
              <StarRoundedIcon fontSize="small" />
            </ListItemIcon>
            {t("Thanks for your review!")}
          </MenuItem>
        )
      );
    }

    if (!isBooked) {
      items.push(
        <MenuItem key="again" onClick={bookAgain}>
          <ListItemIcon>
            <ReplayRoundedIcon fontSize="small" />
          </ListItemIcon>
          {t("Book again")}
        </MenuItem>
      );
    }

    if ((isBooked || status === ReserveStatus.NOSHOW) && barberId) {
      items.push(
        <MenuItem key="contact" onClick={contactBarber}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          {t("Contact barber")}
        </MenuItem>
      );
    }

    if (isBooked && isUpcoming) {
      items.push(
        <MenuItem key="cancel" onClick={askCancel} className="statusMenuDanger">
          <ListItemIcon>
            <EventBusyOutlinedIcon fontSize="small" />
          </ListItemIcon>
          {t("Cancel booking")}
        </MenuItem>
      );
    }

    return items;
  })();

  const isExpanded = noteOpen || (reviewOpen && canWriteReview);

  return (
    <article
      className={`reservationCard status-${statusMeta.className} ${isExpanded ? "is-expanded" : ""}`}
    >
      {/* COMMENT: 16:9 image flush to the top, status pill on top-left */}
      <div className="cardMedia">
        {!imgLoaded && (
          <Skeleton variant="rectangular" animation="wave" className="mediaSkeleton" />
        )}
        <img
          ref={imgRef}
          src={imgSrc}
          alt={serviceTitle}
          className={`${imgLoaded ? "is-loaded" : ""} ${imgSrc === FALLBACK_IMAGE ? "is-fallback" : ""}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
            else setImgLoaded(true);
          }}
        />
        <span className="statusBadge">
          <span className="statusDot" aria-hidden="true" />
          {t(statusMeta.label)}
        </span>
      </div>

      <div className="cardBody">
        {/* COMMENT: date + time */}
        <div className="dateTimeRow">
          {dateLabel && (
            <span className="dateTimeItem">
              <CalendarTodayOutlinedIcon aria-hidden="true" />
              {dateLabel}
            </span>
          )}
          {timeLabel && (
            <span className="dateTimeItem">
              <AccessTimeRoundedIcon aria-hidden="true" />
              {timeLabel}
            </span>
          )}
        </div>

        {/* COMMENT: service name + price */}
        <div className="titleRow">
          <h3 className="serviceName" title={serviceTitle}>
            {serviceTitle}
          </h3>
          <span className="price">${reservation.servicePrice}</span>
        </div>

        {/* COMMENT: barber + duration */}
        <div className="metaRow">
          {barberName && (
            <span className="metaItem barber">
              {barberImage ? (
                <img className="barberAvatar" src={barberImage} alt="" />
              ) : (
                <span className="barberAvatar barberInitial" aria-hidden="true">
                  {barberInitial}
                </span>
              )}
              <span className="barberName">{t("with {{name}}", { name: barberName })}</span>
            </span>
          )}
          {!!reservation.serviceDurationMin && (
            <span className="metaItem">
              <TimerOutlinedIcon aria-hidden="true" />
              {reservation.serviceDurationMin} {t("min")}
            </span>
          )}
        </div>

        {/* COMMENT: divider row with the booking date */}
        <div className="dividerRow">
          {bookedOnLabel && (
            <span className="bookedOn">
              {t("Booked on")} {bookedOnLabel}
            </span>
          )}
        </div>

        {/* COMMENT: collapsible client note (only when there is one) */}
        {reserveNotes && (
          <div className="noteBlock">
            <button
              type="button"
              className={`noteToggle ${noteOpen ? "is-open" : ""}`}
              aria-expanded={noteOpen}
              aria-controls={noteId}
              onClick={() => setNoteOpen((prev) => !prev)}
            >
              <ChatBubbleOutlineRoundedIcon className="noteToggleIcon" aria-hidden="true" />
              <span>{t("Your note")}</span>
              <ExpandMoreRoundedIcon className="noteChevron" aria-hidden="true" />
            </button>
            <div
              id={noteId}
              className={`noteCollapse ${noteOpen ? "is-open" : ""}`}
              aria-hidden={!noteOpen}
            >
              <div className="noteCollapseInner">
                <p className="noteText">{reserveNotes}</p>
              </div>
            </div>
          </div>
        )}

        {/* COMMENT: status row; the value opens the context actions */}
        <div className="statusRow">
          <span className="statusLabel">{t("Status:")}</span>
          <Tooltip title={statusHint} arrow placement="top" disableHoverListener={!statusHint} disableFocusListener={!statusHint} disableTouchListener={!statusHint}>
            <button
              type="button"
              className="statusTrigger"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuId : undefined}
              onClick={openMenu}
            >
              {t(statusMeta.label)}
              <ExpandMoreRoundedIcon className="statusChevron" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>

        <Menu
          id={menuId}
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ className: "statusMenuPaper" }}
        >
          {menuItems}
        </Menu>

        {/* COMMENT: review form opens inside this card only */}
        {reviewOpen && canWriteReview && (
          <div className="cardPanel" id={reviewId}>
            <span className="panelTitle">{t("Your Rating")}</span>
            <Rating
              value={reviewRating}
              onChange={(_, v) => setReviewRating(v ?? 0)}
              className="ratingStars"
            />
            <label className="panelTitle" htmlFor={`${reviewId}-text`}>
              {t("Your Review")}
            </label>
            <textarea
              id={`${reviewId}-text`}
              className="panelInput"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder={t("Write your review...")}
            />
            <div className="panelButtons">
              <Button className="actionBtn actionBtn--outlined" onClick={() => setReviewOpen(false)}>
                {t("Close review")}
              </Button>
              <Button
                className="actionBtn actionBtn--primary"
                onClick={submitReview}
                disabled={reviewSubmitting || !reviewRating || hasSubmittedReview}
              >
                {t("Submit Review")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* COMMENT: confirmation before cancelling */}
      <Dialog
        open={cancelDialogOpen}
        onClose={closeCancelDialog}
        aria-labelledby={`${uid}-cancel-title`}
        PaperProps={{ className: "cancelDialogPaper" }}
      >
        <DialogTitle id={`${uid}-cancel-title`} className="cancelDialogTitle">
          {t("Cancel this booking?")}
        </DialogTitle>
        <DialogContent className="cancelDialogContent">
          <p className="cancelDialogSummary">
            {serviceTitle}
            {dateLabel && ` · ${dateLabel}`}
            {timeLabel && `, ${timeLabel}`}
          </p>
          <label className="cancelDialogLabel" htmlFor={`${uid}-cancel-reason`}>
            {t("Cancellation reason")}
          </label>
          <textarea
            id={`${uid}-cancel-reason`}
            className="cancelDialogInput"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder={t("Write the reason...")}
          />
        </DialogContent>
        <DialogActions className="cancelDialogActions">
          <Button className="dialogBtn dialogBtn--outlined" onClick={closeCancelDialog} disabled={cancelSubmitting}>
            {t("Keep booking")}
          </Button>
          <Button className="dialogBtn dialogBtn--danger" onClick={confirmCancel} disabled={cancelSubmitting}>
            {t("Cancel booking")}
          </Button>
        </DialogActions>
      </Dialog>
    </article>
  );
};

/** COMMENT: placeholder card shown while reservations are loading */
export const ReservationCardSkeleton: FC = () => (
  <div className="reservationCard reservationCard--skeleton" aria-hidden="true">
    <div className="cardMedia">
      <Skeleton variant="rectangular" animation="wave" className="mediaSkeleton" />
    </div>
    <div className="cardBody">
      <Skeleton animation="wave" width="65%" height={18} />
      <Skeleton animation="wave" width="85%" height={26} />
      <Skeleton animation="wave" width="50%" height={20} />
      <Skeleton animation="wave" width="40%" height={16} />
      <Skeleton animation="wave" width="100%" height={22} />
    </div>
  </div>
);

export default ReservationCard;
