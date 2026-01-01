import React from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import MyFavorites from "../../libs/components/mypage/MyFavorites";
import MyProfile from "../../libs/components/mypage/MyProfile";
import MyArticles from "../../libs/components/mypage/MyArticles";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import MyMenu from "../../libs/components/mypage/MyMenu";
import WriteArticle from "../../libs/components/mypage/WriteArticle";
import MemberFollowers from "../../libs/components/barberPage/MemberFollowers";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import MemberFollowings from "../../libs/components/barberPage/MemberFollowings";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  LIKE_TARGET_MEMBER,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "../../apollo/user/mutation";
import { Messages } from "../../libs/config";
import MySchedule from "../../libs/components/mypage/MySchedule";
import ReservationCard from "../../libs/components/mypage/MyReservations";
import { useTranslation } from "react-i18next";
import AddService from "../../libs/components/mypage/AddNewService";
import OurServiceList from "../../libs/components/mypage/OurService";
import OurMemberList from "../../libs/components/mypage/OurMembers";
import OurCommunityArticle from "../../libs/components/mypage/OurCommunityArticle";
import { OurStatistics } from "../../libs/components/mypage/OurStatistics";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const MyPage: NextPage = () => {
  const { t, i18n } = useTranslation("common");
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const category: any = router.query?.category ?? "myProfile";

  /** APOLLO REQUESTS **/
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** HANDLERS **/
  const likeMemberHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);

      // execute likeTargetProperty Mutation
      await likeTargetMember({ variables: { input: id } });

      await sweetTopSmallSuccessAlert("success", 800);
      await refetch({ input: query });
    } catch (error: any) {
      sweetMixinErrorAlert(error.message).then();
    }
  };

  const subscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) throw new Error(Messages.error1);
      if (!user._id) throw new Error(Messages.error2);

      await subscribe({
        variables: {
          input: id,
        },
      });
      await sweetTopSmallSuccessAlert("Subscribed!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) throw new Error(Messages.error1);
      if (!user._id) throw new Error(Messages.error2);

      await unsubscribe({
        variables: {
          input: id,
        },
      });
      await sweetTopSmallSuccessAlert("Unsubscribed!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user?._id)
        await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  if (device === "mobile") {
    return <div>MY PAGE</div>;
  } else {
    return (
      <div id="my-page" style={{ position: "relative" }}>
        <Typography className="hero-title">{t("My Page")}</Typography>
        <div className="container">
          <Stack className={"my-page"}>
            <Stack className={"back-frame"}>
              <Stack className={"left-config"}>
                <MyMenu />
              </Stack>
              <Stack className="main-config" mb={"76px"}>
                <Stack className={"list-config"}>
                  {category === "addService" && <AddService />}
                  {category === "ourServices" && <OurServiceList />}
                  {category === "ourMembers" && <OurMemberList />}
                  {category === "ourArticles" && <OurCommunityArticle />}
                  {category === "ourStatistics" && <OurStatistics />}
                  {category === "myReservations" && <ReservationCard />}
                  {category === "mySchedule" && <MySchedule />}
                  {category === "myFavorites" && <MyFavorites />}
                  {category === "myArticles" && <MyArticles />}
                  {category === "writeArticle" && <WriteArticle />}
                  {category === "myProfile" && <MyProfile />}
                  {category === "followers" && (
                    <MemberFollowers
                      subscribeHandler={subscribeHandler}
                      unsubscribeHandler={unsubscribeHandler}
                      redirectToMemberPageHandler={redirectToMemberPageHandler}
                      likeMemberHandler={likeMemberHandler}
                    />
                  )}
                  {category === "followings" && (
                    <MemberFollowings
                      subscribeHandler={subscribeHandler}
                      unsubscribeHandler={unsubscribeHandler}
                      redirectToMemberPageHandler={redirectToMemberPageHandler}
                      likeMemberHandler={likeMemberHandler}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </div>
      </div>
    );
  }
};

export default withLayoutBasic(MyPage);
