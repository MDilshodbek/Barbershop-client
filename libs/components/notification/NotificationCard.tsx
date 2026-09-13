import { Box, Button, Stack } from "@mui/material";
import { FC } from "react";
import { Notification } from "../../types/notification/notification";
import {
  NotificationStatus,
  NotificationType,
} from "../../enums/notification.enum";
import { useMutation } from "@apollo/client";
import {
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ,
} from "../../../apollo/user/mutation";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useDeviceDetect from "../../hooks/useDeviceDetect";

interface NoticeProps {
  notice: Notification[];
  onRefresh?: () => void;
}

const NotificationCard: FC<NoticeProps> = ({ notice, onRefresh }) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const router = useRouter();
  const [markAllNotificationsRead, { loading: allLoading }] = useMutation(
    MARK_ALL_NOTIFICATIONS_READ,
    {
      onCompleted: () => {
        onRefresh && onRefresh();
      },
    }
  );
  const [markNotificationRead] = useMutation(MARK_NOTIFICATION_READ, {
    onCompleted: () => {
      onRefresh && onRefresh();
    },
  });

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
    } catch (e) {
      console.error("Failed to mark all notifications read", e);
    }
  };

  const handleCardClick = async (item: Notification) => {
    try {
      await markNotificationRead({
        variables: { notificationId: item._id },
      });
    } catch (e) {
      console.error("Failed to mark notification read", e);
    }

    let target = "/mypage";
    switch (item.notificationType) {
      case NotificationType.FOLLOW:
        target = "/mypage?category=followers";
        break;
      case NotificationType.LIKE:
        target = "/mypage?category=myFavorites";
        break;
      case NotificationType.REVIEW:
        target = `/barber/detail?barberId=${item.receiverId}&category=reviews`;
        break;
      case NotificationType.COMMENT:
        target = "/mypage?category=myArticles";
        break;
      case NotificationType.RATE_SERVICE:
        target = "/mypage?category=myReservations";
        break;
      case NotificationType.APPOINTMENT:
      default:
        target = "/mypage?category=mySchedule";
        break;
    }

    router
      .push(target)
      .catch((err) =>
        console.error("Failed to navigate from notification", err)
      );
  };

  if (device === "mobile") {
    return (
      <Stack className={"notice-content-mobile"}>
        <Stack className="title-box-mobile">
          <span className={"title"}>{t("Notice")}</span>
          <Button
            className="read-all"
            onClick={handleReadAll}
            disabled={allLoading}
          >
            {t("Read All")}
          </Button>
        </Stack>
        <Stack className={"notice-list-mobile"}>
          {notice.map((item: Notification) => (
            <div
              className={`notice-card-mobile ${
                item.notificationStatus === NotificationStatus.UNREAD
                  ? "unread"
                  : ""
              }`}
              key={item._id}
              onClick={() => handleCardClick(item)}
            >
              {item.notificationStatus === NotificationStatus.UNREAD && (
                <span className="unread-dot" />
              )}
              <span className={"notice-title-mobile"}>
                {item.notificationMessage}
              </span>
              <span className={"notice-date-mobile"}>
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className={"notice-content"}>
      <Stack className="title-box">
        <span className={"title"}>{t("Notice")}</span>
        <Button
          className="read-all"
          onClick={handleReadAll}
          disabled={allLoading}
        >
          {t("Read All")}
        </Button>
      </Stack>
      <Stack className={"main"}>
        <Box component={"div"} className={"top"}>
          <span>{t("number")}</span>
          <span>{t("title")}</span>
          <span>{t("date")}</span>
        </Box>
        <Stack className={"bottom"}>
          {notice.map((item: Notification, index: number) => (
            <div
              className={`notice-card ${
                item.notificationStatus === NotificationStatus.UNREAD
                  ? "unread"
                  : ""
              }`}
              key={item._id}
              onClick={() => handleCardClick(item)}
            >
              <span className={"notice-number"}>{index + 1}</span>
              <span className={"notice-title"}>{item.notificationMessage}</span>
              <span className={"notice-date"}>
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NotificationCard;
