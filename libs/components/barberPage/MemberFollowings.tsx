import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Pagination, Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useRouter } from "next/router";
import { FollowInquiry } from "../../types/follow/follow.input";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Following } from "../../types/follow/follow";
import { REACT_APP_API_URL } from "../../config";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { userVar } from "../../../apollo/store";
import { GET_MEMBER_FOLLOWINGS } from "../../../apollo/user/query";
import { T } from "../../types/common";
import { useTranslation } from "react-i18next";

interface MemberFollowingsProps {
  initialInput: FollowInquiry;
  subscribeHandler: any;
  unsubscribeHandler: any;
  redirectToMemberPageHandler: any;
  likeMemberHandler: any;
}

const MemberFollowings = (props: MemberFollowingsProps) => {
  const {
    initialInput,
    subscribeHandler,
    unsubscribeHandler,
    redirectToMemberPageHandler,
    likeMemberHandler,
  } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const { t } = useTranslation("common");
  const [total, setTotal] = useState<number>(0);
  const [followInquiry, setFollowInquiry] =
    useState<FollowInquiry>(initialInput);
  const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: getMemberFollowingsLoading,
    data: getMemberFollowingsData,
    error: getMemberFollowingsError,
    refetch: getMemberFollowingsRefetch,
  } = useQuery(GET_MEMBER_FOLLOWINGS, {
    fetchPolicy: "network-only",
    variables: { input: followInquiry },
    skip: !followInquiry?.search?.followerId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMemberFollowings(data?.getMemberFollowings?.list);
      setTotal(data?.getMemberFollowings?.metaCounter?.[0]?.total);
    },
    onError: (error) => {
      console.error("Error fetching followings:", error);
    },
  });

  /** LIFECYCLES **/

  useEffect(() => {
    if (!router.isReady) return;

    const barberId = router.query.barberId as string | undefined;
    const targetId = barberId ?? user?._id;

    if (!targetId) return;

    setFollowInquiry((prev) => ({
      ...prev,
      page: 1,
      search: {
        ...prev.search,
        followerId: targetId,
      },
    }));
  }, [router.isReady, router.query.barberId, user?._id]);

  useEffect(() => {
    if (!followInquiry.search?.followerId) return;

    getMemberFollowingsRefetch({ input: followInquiry }).then();
  }, [followInquiry, getMemberFollowingsRefetch]);

  /** HANDLERS **/
  const paginationHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    // COMMENT: do not mutate, make a new object
    setFollowInquiry((prev) => ({
      ...prev,
      page: value,
    }));
  };

  if (device === "mobile") {
    return (
      <div id="member-follows-page-mobile">
        <Stack className="follows-list-mobile">
          {memberFollowings?.length === 0 && (
            <div className={"no-data"}>
              <InfoOutlinedIcon className="info-icon" />
              <p>{t("No Followings yet!")}</p>
            </div>
          )}

          {memberFollowings.map((follow: Following) => {
            const imagePath: string = follow?.followingData?.memberImage
              ? `${REACT_APP_API_URL}/${follow.followingData.memberImage}`
              : "/logo/defaultUser.svg";

            return (
              <Stack className="follow-card" key={follow._id}>
                <Stack
                  className="follow-card-top"
                  onClick={() =>
                    redirectToMemberPageHandler(follow?.followingData?._id)
                  }
                >
                  <img className="follow-avatar" src={imagePath} alt="" />
                  <Stack className="follow-info">
                    <span className="follow-name">
                      {follow?.followingData?.memberNick}
                    </span>
                    <Stack className="follow-stats">
                      <span>
                        {t("Followers")} (
                        {follow?.followingData?.memberFollowers})
                      </span>
                      <span>
                        {t("Followings")} (
                        {follow?.followingData?.memberFollowings})
                      </span>
                    </Stack>
                  </Stack>
                  <Box
                    className="follow-like"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      likeMemberHandler(
                        follow?.followingData?._id,
                        getMemberFollowingsRefetch,
                        followInquiry
                      );
                    }}
                  >
                    {follow?.meLiked && follow?.meLiked[0]?.myFavorite ? (
                      <FavoriteIcon color="primary" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                    <span>({follow?.followingData?.memberLikes})</span>
                  </Box>
                </Stack>

                <Stack className="follow-action">
                  {user?._id === follow?.followingId ? (
                    <Button disabled className="self-button">
                      {t("Its You")}
                    </Button>
                  ) : follow.meFollowed && follow.meFollowed[0]?.myFollowing ? (
                    <Button
                      className="unfollow-btn"
                      onClick={() =>
                        unsubscribeHandler(
                          follow?.followingData?._id,
                          getMemberFollowingsRefetch,
                          followInquiry
                        )
                      }
                    >
                      {t("Unfollow")}
                    </Button>
                  ) : (
                    <Button
                      className="follow-btn"
                      onClick={() =>
                        subscribeHandler(
                          follow?.followingData?._id,
                          getMemberFollowingsRefetch,
                          followInquiry
                        )
                      }
                    >
                      {t("Follow")}
                    </Button>
                  )}
                </Stack>
              </Stack>
            );
          })}
        </Stack>

        {memberFollowings.length !== 0 && (
          <Stack className="pagination-config-mobile">
            <Pagination
              page={followInquiry.page}
              count={Math.ceil(total / followInquiry.limit)}
              onChange={paginationHandler}
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
            <span className="page-text">
              {total} {t("followings")}
            </span>
          </Stack>
        )}
      </div>
    );
  } else {
    return (
      <div id="member-follows-page">
        <Stack className="follows-list-box">
          <Stack className="listing-title-box">
            <Typography className="title-text">{t("Name")}</Typography>
            <Typography className="title-text">{t("Details")}</Typography>
            <Typography className="title-text">{t("Subscription")}</Typography>
          </Stack>

          {memberFollowings?.length === 0 && (
            <div className={"no-data"}>
              <InfoOutlinedIcon className="info-icon" />
              <p>{t("No Followings yet!")}</p>
            </div>
          )}

          {memberFollowings.map((follow: Following) => {
            const imagePath: string = follow?.followingData?.memberImage
              ? `${REACT_APP_API_URL}/${follow.followingData.memberImage}`
              : "/logo/defaultUser.svg";

            return (
              <Stack className="follows-card-box" key={follow._id}>
                <Stack
                  className={"info"}
                  onClick={() =>
                    redirectToMemberPageHandler(follow?.followingData?._id)
                  }
                >
                  <Stack className="image-box">
                    <img src={imagePath} alt="" />
                  </Stack>
                  <Stack className="information-box">
                    <Typography className="name">
                      {follow?.followingData?.memberNick}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack className={"details-box"}>
                  <Box className={"info-box"} component={"div"}>
                    <p>{t("Followers")}</p>
                    <span>({follow?.followingData?.memberFollowers})</span>
                  </Box>
                  <Box className={"info-box"} component={"div"}>
                    <p>{t("Followings")}</p>
                    <span>({follow?.followingData?.memberFollowings})</span>
                  </Box>
                  <Box className={"info-box"} component={"div"}>
                    {follow?.meLiked && follow?.meLiked[0]?.myFavorite ? (
                      <FavoriteIcon
                        color="primary"
                        onClick={() =>
                          likeMemberHandler(
                            follow?.followingData?._id,
                            getMemberFollowingsRefetch,
                            followInquiry
                          )
                        }
                      />
                    ) : (
                      <FavoriteBorderIcon
                        onClick={() =>
                          likeMemberHandler(
                            follow?.followingData?._id,
                            getMemberFollowingsRefetch,
                            followInquiry
                          )
                        }
                      />
                    )}
                    <span>({follow?.followingData?.memberLikes})</span>
                  </Box>
                </Stack>

                <Stack className="action-box">
                  {user?._id === follow?.followingId ? (
                    <Button
                      variant="outlined"
                      disabled
                      className="self-button"
                      sx={{
                        background: "#004034",
                        color: "#fff !important",
                        ":hover": { background: "#004034" },
                      }}
                    >
                      {t("Its You")}
                    </Button>
                  ) : follow.meFollowed && follow.meFollowed[0]?.myFollowing ? (
                    <>
                      <Typography>{t("Following")}</Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          background: "#004034",
                          ":hover": { background: "#004034" },
                          color: "#fff !important",
                        }}
                        onClick={() =>
                          unsubscribeHandler(
                            follow?.followingData?._id,
                            getMemberFollowingsRefetch,
                            followInquiry
                          )
                        }
                      >
                        {t("Unfollow")}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        background: "#C6D984",
                        ":hover": { background: "#C6D984" },
                      }}
                      onClick={() =>
                        subscribeHandler(
                          follow?.followingData?._id,
                          getMemberFollowingsRefetch,
                          followInquiry
                        )
                      }
                    >
                      {t("Follow")}
                    </Button>
                  )}
                </Stack>
              </Stack>
            );
          })}
        </Stack>

        {memberFollowings.length !== 0 && (
          <Stack className="pagination-config">
            <Stack className="pagination-box">
              <Pagination
                page={followInquiry.page}
                count={Math.ceil(total / followInquiry.limit)}
                onChange={paginationHandler}
                shape="circular"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#004034",
                    borderColor: "#004034",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#C6D984",
                    color: "#fff",
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "#C6D984",
                    color: "#fff",
                  },
                }}
              />
            </Stack>
            <Stack className="total-result">
              <Typography className="page-text">{total} {t("followings")}</Typography>
            </Stack>
          </Stack>
        )}
      </div>
    );
  }
};

MemberFollowings.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    search: {
      followerId: "",
    },
  },
};

export default MemberFollowings;
