// COMMENT: keep imports, only remove unused ones
import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Pagination, Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useRouter } from "next/router";
import { FollowInquiry } from "../../types/follow/follow.input";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Follower } from "../../types/follow/follow";
import { REACT_APP_API_URL } from "../../config";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { userVar } from "../../../apollo/store";
import { T } from "../../types/common";
import { GET_MEMBER_FOLLOWERS } from "../../../apollo/user/query";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface MemberFollowsProps {
  initialInput: FollowInquiry;
  subscribeHandler: any;
  unsubscribeHandler: any;
  redirectToMemberPageHandler: any;
  likeMemberHandler: any;
}

const MemberFollowers = (props: MemberFollowsProps) => {
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
  const [total, setTotal] = useState<number>(0);
  const [followInquiry, setFollowInquiry] =
    useState<FollowInquiry>(initialInput);
  const [memberFollowers, setMemberFollowers] = useState<Follower[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: getMemberFollowersLoading,
    data: getMemberFollowersData,
    error: getMemberFollowersError,
    refetch: getMemberFollowersRefetch,
  } = useQuery(GET_MEMBER_FOLLOWERS, {
    fetchPolicy: "network-only",
    variables: { input: followInquiry },
    skip: !followInquiry?.search?.followingId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getMemberFollowers) {
        setMemberFollowers(data.getMemberFollowers.list || []);
        setTotal(data.getMemberFollowers.metaCounter[0]?.total || 0);
      }
    },
    onError: (error) => {
      console.error("Error fetching followers:", error);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (!router.isReady) return;

    const barberId = router.query.barberId as string | undefined;

    if (barberId) {
      setFollowInquiry((prev) => ({
        ...prev,
        page: 1, 
        search: {
          ...prev.search,
          followingId: barberId,
        },
      }));
    } else if (user?._id) {
      setFollowInquiry((prev) => ({
        ...prev,
        page: 1,
        search: {
          ...prev.search,
          followingId: user._id,
        },
      }));
    }
  }, [router.isReady, router.query.barberId, user?._id]);


  /** HANDLERS **/
  const paginationHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    setFollowInquiry((prev) => ({
      ...prev,
      page: value,
    }));
  };

  if (device === "mobile") {
    return <div>CROPPER FOLLOWS MOBILE</div>;
  } else {
    return (
      <div id="member-follows-page">
        <Stack className="follows-list-box">
          <Stack className="listing-title-box">
            <Typography className="title-text">Name</Typography>
            <Typography className="title-text">Details</Typography>
            <Typography className="title-text">Subscription</Typography>
          </Stack>

          {/* COMMENT: empty state */}
          {memberFollowers?.length === 0 && !getMemberFollowersLoading && (
            <div className={"no-data"}>
              <InfoOutlinedIcon className="info-icon" />
              <p>No followers yet!</p>
            </div>
          )}

          {/* COMMENT: list followers */}
          {memberFollowers.map((follower: Follower) => {
            const imagePath: string = follower?.followerData?.memberImage
              ? `${REACT_APP_API_URL}/${follower?.followerData?.memberImage}`
              : "/logo/defaultUser.svg";

            return (
              <Stack className="follows-card-box" key={follower._id}>
                <Stack
                  className={"info"}
                  onClick={() =>
                    redirectToMemberPageHandler(follower?.followerData?._id)
                  }
                >
                  <Stack className="image-box">
                    <img src={imagePath} alt="" />
                  </Stack>
                  <Stack className="information-box">
                    <Typography className="name">
                      {follower?.followerData?.memberNick}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack className={"details-box"}>
                  <Box className={"info-box"} component={"div"}>
                    <p>Followers</p>
                    <span>({follower?.followerData?.memberFollowers})</span>
                  </Box>
                  <Box className={"info-box"} component={"div"}>
                    <p>Followings</p>
                    <span>({follower?.followerData?.memberFollowings})</span>
                  </Box>
                  <Box className={"info-box"} component={"div"}>
                    {follower?.meLiked && follower?.meLiked[0]?.myFavorite ? (
                      <FavoriteIcon
                        color="primary"
                        onClick={() =>
                          likeMemberHandler(
                            follower?.followerData?._id,
                            getMemberFollowersRefetch,
                            followInquiry
                          )
                        }
                      />
                    ) : (
                      <FavoriteBorderIcon
                        onClick={() =>
                          likeMemberHandler(
                            follower?.followerData?._id,
                            getMemberFollowersRefetch,
                            followInquiry
                          )
                        }
                      />
                    )}
                    <span>({follower?.followerData?.memberLikes})</span>
                  </Box>
                </Stack>

                {user?._id !== follower?.followerId && (
                  <Stack className="action-box">
                    {follower.meFollowed &&
                    follower.meFollowed[0]?.myFollowing ? (
                      <>
                        <Typography>Following</Typography>
                        <Button
                          variant="outlined"
                          sx={{
                            background: "#ed5858",
                            ":hover": { background: "#ee7171" },
                          }}
                          onClick={() =>
                            unsubscribeHandler(
                              follower?.followerData?._id,
                              getMemberFollowersRefetch,
                              followInquiry
                            )
                          }
                        >
                          Unfollow
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
                            follower?.followerData?._id,
                            getMemberFollowersRefetch,
                            followInquiry
                          )
                        }
                      >
                        Follow
                      </Button>
                    )}
                  </Stack>
                )}
              </Stack>
            );
          })}
        </Stack>

        {memberFollowers.length !== 0 && (
          <Stack className="pagination-config">
            <Stack className="pagination-box">
              <Pagination
                page={followInquiry.page}
                count={Math.ceil(total / followInquiry.limit)}
                onChange={paginationHandler}
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
            <Stack className="total-result">
              <Typography>
                {total} follower{total > 1 ? "s" : ""}
              </Typography>
            </Stack>
          </Stack>
        )}
      </div>
    );
  }
};

MemberFollowers.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    search: {
      followingId: "",
    },
  },
};

export default MemberFollowers;
