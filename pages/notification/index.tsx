import { Box, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { useTranslation } from "next-i18next";
import NotificationCard from "../../libs/components/notification/NotificationCard";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Notification } from "../../libs/types/notification/notification";
import { NotificationInquiry } from "../../libs/types/notification/notification.input";
import { GET_MEMBER_ALL_NOTIFICATIONS } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface NoticeProps {
  initialInput: NotificationInquiry;
}

const NotificationPage: NextPage<NoticeProps> = (props) => {
  const { t, i18n } = useTranslation("common");
  const [notice, setNotice] = useState<Notification[]>([]);
  const [total, setTotal] = useState<number>(0);
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

  console.log("notice:", notice);

  const data = [
    {
      no: 1,
      status: true,
      title: "Register to use and get discounts",
      date: "01.03.2024",
    },
    {
      no: 2,
      title: "It's absolutely free to upload and trade properties",
      date: "31.03.2024",
    },
  ];

  return (
    <Stack className="notification-page">
      <Typography className="hero-title">{t("Notification")}</Typography>
      <Stack className="container">
        {notice.length === 0 ? (
          <Box component={"div"} className="empty-list">
            There is no notifications yet!
          </Box>
        ) : (
          <NotificationCard
            notice={notice}
            onRefresh={() => getMemberAllNotificationsRefetch()}
          />
        )}
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
