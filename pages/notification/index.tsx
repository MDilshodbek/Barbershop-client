import { Box, Pagination, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { useTranslation } from "next-i18next";
import NotificationCard from "../../libs/components/notification/NotificationCard";
import { useQuery } from "@apollo/client";
import { ChangeEvent, useState } from "react";
import { Notification } from "../../libs/types/notification/notification";
import { NotificationInquiry } from "../../libs/types/notification/notification.input";
import { GET_MEMBER_ALL_NOTIFICATIONS } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";

interface NoticeProps {
  initialInput: NotificationInquiry;
}

const NotificationPage: NextPage<NoticeProps> = (props) => {
  const { t, i18n } = useTranslation("common");
  const device = useDeviceDetect();
  const [notice, setNotice] = useState<Notification[]>([]);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    initialInput = {
      page: 1,
      limit: 10,
    },
  } = props;
  const [searchFilter, setSearchFilter] =
    useState<NotificationInquiry>(initialInput);

  const {
    loading: getMemberAllNotificationsLoading,
    data: getMemberAllNotificationsData,
    error: getMemberAllNotificationsError,
    refetch: getMemberAllNotificationsRefetch,
  } = useQuery(GET_MEMBER_ALL_NOTIFICATIONS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setNotice(data?.getMemberAllNotifications?.list);
      setTotal(data?.getMemberAllNotifications?.metaCounter[0]?.total);
    },
  });

  const paginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    const nextFilter = {
      ...searchFilter,
      page: value,
    };

    setSearchFilter(nextFilter);
    setCurrentPage(value);

    const encoded = encodeURIComponent(JSON.stringify(nextFilter));
    router.replace(
      `/notification?input=${encoded}`,
      `/notification?input=${encoded}`,
      {
        scroll: false,
      }
    );
  };

  if (device === "mobile") {
    return (
      <Stack className="notification-page-mobile">
        <Typography className="hero-title">{t("Notification")}</Typography>
        <Stack className="container">
          {notice.length === 0 ? (
            <Box component={"div"} className="empty-list">
              <span className={"no-data"}>
                <InfoOutlinedIcon className="info-icon" />
                <p>{t("There is no notifications yet!")}</p>
              </span>
            </Box>
          ) : (
            <NotificationCard
              notice={notice}
              onRefresh={() => getMemberAllNotificationsRefetch()}
            />
          )}
          {notice.length !== 0 && (
            <Stack className={"pagination-config-mobile"}>
              {Math.ceil(total / searchFilter.limit) > 1 && (
                <Pagination
                  page={searchFilter.page ?? 1}
                  count={Math.ceil(total / searchFilter.limit)}
                  onChange={paginationChangeHandler}
                  shape="circular"
                  size="small"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#004034",
                      borderColor: "#004034",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#C6D984",
                      color: "#fff",
                    },
                  }}
                />
              )}
              <span className="page-text">
                {t("Total")} {total}{" "}
                {total > 1 ? t("notifications") : t("notification")}{" "}
                {t("available")}
              </span>
            </Stack>
          )}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className="notification-page">
      <Typography className="hero-title">{t("Notification")}</Typography>
      <Stack className="container">
        {notice.length === 0 ? (
          <Box component={"div"} className="empty-list">
            <span className={"no-data"}>
              <InfoOutlinedIcon className="info-icon" />
              <p>{t("There is no notifications yet!")}</p>
            </span>
          </Box>
        ) : (
          <NotificationCard
            notice={notice}
            onRefresh={() => getMemberAllNotificationsRefetch()}
          />
        )}
        <Stack className={"pagination"}>
          <Stack className="pagination-box">
            {notice.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
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
          </Stack>
          {notice.length !== 0 && (
            <span>
              {t("Total")} {total} {total > 1 ? t("notifications") : t("notification")} {t("available")}
            </span>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

export default withLayoutBasic(NotificationPage);
