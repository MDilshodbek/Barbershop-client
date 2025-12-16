import {
  Box,
  Button,
  IconButton,
  Pagination,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { ChangeEvent, useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import StarIcon from "@mui/icons-material/Star";
import ReviewCard from "../../libs/components/agent/ReviewCard";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import { useRouter } from "next/router";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import { Member } from "../../libs/types/member/member";
import {
  ReviewInput,
  ReviewInquiry,
} from "../../libs/types/review/review.input";
import { Review } from "../../libs/types/review/review";
import { ReviewGroup, ReviewStatus } from "../../libs/enums/review.enum";
import {
  CREATE_REVIEW,
  UPDATE_REVIEW,
  LIKE_TARGET_MEMBER,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "../../apollo/user/mutation";
import { Message } from "../../libs/enums/common.enum";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { T } from "../../libs/types/common";
import { GET_MEMBER, GET_REVIEWS } from "../../apollo/user/query";
import { Messages } from "../../libs/config";
import MemberArticles from "../../libs/components/barberPage/MemberArticles";
import MemberFollowers from "../../libs/components/barberPage/MemberFollowers";
import MemberFollowings from "../../libs/components/barberPage/MemberFollowings";

const BarberDetail: NextPage = ({ initialReview, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [barber, setBarber] = useState<Member | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [reviewInquiry, setReviewInquiry] =
    useState<ReviewInquiry>(initialReview);
  const [barberReviews, setBarberReviews] = useState<Review[]>([]);
  const [reviewTotal, setReviewTotal] = useState<number>(0);
  const category = (router.query.category as string) || "reviews";
  const [insertReviewData, setInsertReviewData] = useState<ReviewInput>({
    reviewGroup: ReviewGroup.MEMBER,
    reviewContent: "",
    reviewRefId: "",
    rating: 0,
  });

  /** APOLLO REQUESTS **/
  const {
    loading: getMemberLoading,
    data: getMemberData,
    error: getMemberError,
    refetch: getMemberRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: "cache-and-network",
    variables: { input: barberId },
    skip: !barberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBarber(data?.getMember);
      setReviewInquiry({
        ...reviewInquiry,
        search: {
          reviewRefId: data?.getMember?._id,
          reviewGroup: ReviewGroup.MEMBER,
        },
      });
      setInsertReviewData({
        ...insertReviewData,
        reviewRefId: data?.getMember?._id,
      });
    },
  });

  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  const {
    loading: getReviewsLoading,
    data: getReviewsData,
    error: getReviewsError,
    refetch: getReviewsRefetch,
  } = useQuery(GET_REVIEWS, {
    fetchPolicy: "network-only",
    variables: {
      input: reviewInquiry,
    },
    skip: !reviewInquiry.search.reviewRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBarberReviews(data?.getReviews?.list);
      setReviewTotal(data?.getReviews?.metaCounter[0]?.total ?? 0);
    },
  });

  const [createReview] = useMutation(CREATE_REVIEW);
  const [updateReview] = useMutation(UPDATE_REVIEW);
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);

  /** LIFECYCLES **/
  useEffect(() => {
    if (!router.isReady) return;

    const idFromQuery = router.query.barberId as string | undefined;

    if (idFromQuery) {
      setBarberId(idFromQuery);
    }
  }, [router.isReady, router.query.barberId]);

  useEffect(() => {
    if (!reviewInquiry.search.reviewRefId) return;

    getReviewsRefetch({ input: reviewInquiry }).then();
  }, [reviewInquiry, getReviewsRefetch]);

  // Handlers
  const likeMemberHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      // execute likeTargetProperty Mutation
      await likeTargetMember({ variables: { input: id } });

      // execute getPropertiesRefetch
      await getMemberRefetch({ input: barberId });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("Error, likePropertyHandler:", error.message);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  const reviewPaginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    setReviewInquiry((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const createReviewHandler = async () => {
    try {
      if (!user._id) throw new Error(Messages.error2);
      if (user._id === barberId)
        throw new Error(`Cannot write review for yourself`);

      if (!insertReviewData.rating || insertReviewData.rating <= 0) {
        throw new Error("Please add a rating before submitting your review");
      }

      await createReview({ variables: { input: insertReviewData } });
      await getReviewsRefetch({ input: reviewInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
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

  const handleCategoryChange = async (nextCategory: string) => {
    if (!barberId) return;

    await router.push(
      {
        pathname: "/barber/detail",
        query: { barberId, category: nextCategory },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  /** COMMENT: update or delete a review (content only) */
  const handleUpdateReview = async (args: {
    reviewId: string;
    reviewContent?: string;
    reviewStatus?: ReviewStatus;
  }) => {
    if (!user?._id) throw new Error(Messages.error2);
    if (!barberId) throw new Error(Messages.error1);
    const { reviewId, reviewContent, reviewStatus } = args;

    await updateReview({
      variables: {
        input: {
          _id: reviewId,
          reviewRefId: barberId,
          ...(reviewContent && { reviewContent }),
          ...(reviewStatus && { reviewStatus }),
        },
      },
    });

    await getReviewsRefetch({ input: reviewInquiry });
  };


  if (device === "mobile") {
    return <Stack>Barber Detail Page mobile</Stack>;
  } else {
    return (
      <Stack className="bdetail-page">
        <Typography className="hero-title">Barber Page</Typography>
        <Stack className="container">
          <Stack className="barber-detail-main">
            <Stack className="bdetail-box">
              <Box>
                <img
                  src={
                    barber?.memberImage
                      ? `${process.env.REACT_APP_API_URL}/${barber?.memberImage}`
                      : "/logo/defaultUser.svg"
                  }
                  alt=""
                />
              </Box>
              <Stack className="bdetail-info">
                <Typography className="barber-name">
                  {barber?.memberFullName}
                </Typography>
                <Stack className="barber-level">
                  <Typography className="barber-level1">Level:</Typography>
                  <Typography className="barber-level2">
                    {barber?.memberLevel}
                  </Typography>
                </Stack>
                <Typography className="barber-desc">
                  {barber?.memberDesc}
                </Typography>
                <Stack className="breview-box">
                  <Rating
                    className="review-starts"
                    value={5}
                    readOnly
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#FFD700 !important",
                      },
                    }}
                  />
                  <Typography className="breview-number">
                    {barber?.memberReviews}
                  </Typography>
                </Stack>
                <Stack className="blike-box">
                  <Box className="barber-like">
                    <IconButton
                      color={"default"}
                      onClick={() => {
                        if (!barber?._id) return;
                        likeMemberHandler(user, barber._id);
                      }}
                    >
                      {barber?.meLiked && barber?.meLiked[0]?.myFavorite ? (
                        <FavoriteIcon style={{ color: "red" }} />
                      ) : (
                        <FavoriteBorderIcon style={{ color: "#004034" }} />
                      )}
                    </IconButton>
                    <Typography className="view-cnt">
                      {barber?.memberLikes}
                    </Typography>
                  </Box>
                  <Box className="barber-like">
                    <IconButton color={"default"}>
                      <RemoveRedEyeIcon
                        style={{
                          color: "#004034",
                          fontSize: "30px",
                        }}
                      />
                    </IconButton>
                    <Typography className="view-cnt">
                      {barber?.memberViews}
                    </Typography>
                  </Box>
                </Stack>
                <Stack className="bcontact-box">
                  <FacebookOutlinedIcon
                    style={{
                      color: "#004034",
                      fontSize: "30px",
                      cursor: "pointer",
                    }}
                  />
                  <InstagramIcon
                    style={{
                      color: "#004034",
                      fontSize: "30px",
                      cursor: "pointer",
                    }}
                  />
                  <XIcon
                    style={{
                      color: "#004034",
                      fontSize: "30px",
                      cursor: "pointer",
                    }}
                  />
                </Stack>
                {user?._id !== barber?._id && (
                  <Stack className="bfollow-box">
                    {barber?.meFollowed && barber.meFollowed[0]?.myFollowing ? (
                      <>
                        <Button
                          sx={{
                            background: "#004034",
                            ":hover": {
                              background: "#004034",
                              border: "transparent",
                            },
                            color: "#fff",
                            borderColor: "transparent",
                          }}
                          onClick={() =>
                            unsubscribeHandler(
                              barber?._id,
                              getMemberRefetch,
                              barberId
                            )
                          }
                          className="follow-butt"
                        >
                          Unfollow
                        </Button>
                        <Typography className="follow-status">
                          Following
                        </Typography>
                      </>
                    ) : (
                      <Button
                        sx={{
                          background: "#C6D984",
                          ":hover": {
                            background: "#C6D984",
                            borderColor: "transparent",
                          },
                          color: "#004034",
                        }}
                        onClick={() => {
                          if (barber?._id) {
                            subscribeHandler(
                              barber._id,
                              getMemberRefetch,
                              barberId
                            );
                          }
                        }}
                        className="follow-butt"
                      >
                        Follow
                      </Button>
                    )}
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Stack className="bdetail-tabs" direction="row" spacing={2} mb={3}>
              <Button
                className={
                  category === "reviews" ? "active-butt" : "default-butt"
                }
                onClick={() => handleCategoryChange("reviews")}
              >
                Reviews
                <span>({barber?.memberReviews})</span>
              </Button>
              <Button
                className={
                  category === "articles" ? "active-butt" : "default-butt"
                }
                onClick={() => handleCategoryChange("articles")}
              >
                Articles
                <span>({barber?.memberArticles})</span>
              </Button>
              <Button
                className={
                  category === "followers" ? "active-butt" : "default-butt"
                }
                onClick={() => handleCategoryChange("followers")}
              >
                Followers
                <span>({barber?.memberFollowers})</span>
              </Button>
              <Button
                className={
                  category === "followings" ? "active-butt" : "default-butt"
                }
                onClick={() => handleCategoryChange("followings")}
              >
                Followings
                <span>({barber?.memberFollowings})</span>
              </Button>
            </Stack>

            {category === "reviews" && (
              <Stack className={"review-box"}>
                <Stack className={"main-intro"}>
                  <span>Reviews</span>
                  <p>we are glad to see you again</p>
                </Stack>

                {reviewTotal !== 0 && (
                  <Stack className={"review-wrap"}>
                    <Box component={"div"} className={"title-box"}>
                      <StarIcon />
                      <span>
                        {reviewTotal} review{reviewTotal > 1 ? "s" : ""}
                      </span>
                    </Box>
                    {barberReviews?.map((review: Review) => {
                      return (
                        <ReviewCard
                          review={review}
                          key={review?._id}
                          onUpdate={handleUpdateReview}
                        />
                      );
                    })}
                    <Box component={"div"} className={"pagination-box"}>
                      <Pagination
                        page={reviewInquiry.page}
                        count={
                          Math.ceil(reviewTotal / reviewInquiry.limit) || 1
                        }
                        onChange={reviewPaginationChangeHandler}
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
                    </Box>
                  </Stack>
                )}

                <Stack className={"leave-review-config"}>
                  <Typography className={"main-title"}>
                    Leave A Review
                  </Typography>
                  <Typography className={"review-title"}>Rating</Typography>
                  <Box className={"rating-row"}>
                    <Rating
                      value={insertReviewData.rating}
                      onChange={(_, newValue) => {
                        setInsertReviewData({
                          ...insertReviewData,
                          rating: newValue ?? 0,
                        });
                      }}
                      size="large"
                    />
                    <Typography className={"rating-value"}>
                      {insertReviewData.rating > 0
                        ? `${insertReviewData.rating.toFixed(1)} / 5`
                        : "No rating yet"}
                    </Typography>
                  </Box>
                  <Typography className={"review-title"}>Review</Typography>
                  <textarea
                    className="review-content"
                    onChange={({ target: { value } }: any) => {
                      setInsertReviewData({
                        ...insertReviewData,
                        reviewContent: value,
                      });
                    }}
                    value={insertReviewData.reviewContent}
                  ></textarea>
                  <Box className={"submit-btn"} component={"div"}>
                    <Button
                      className={"submit-review"}
                      disabled={
                        insertReviewData.reviewContent === "" ||
                        user?._id === ""
                      }
                      onClick={createReviewHandler}
                    >
                      <Typography className={"title"}>Submit Review</Typography>
                      {/* svg same as before */}
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            )}

            {category === "articles" && (
              <Stack className="button-router">
                <MemberArticles />
              </Stack>
            )}

            {category === "followers" && (
              <Stack className="button-router">
                <MemberFollowers
                  subscribeHandler={subscribeHandler}
                  unsubscribeHandler={unsubscribeHandler}
                  redirectToMemberPageHandler={redirectToMemberPageHandler}
                  likeMemberHandler={likeMemberHandler}
                />
              </Stack>
            )}

            {category === "followings" && (
              <Stack className="button-router">
                <MemberFollowings
                  subscribeHandler={subscribeHandler}
                  unsubscribeHandler={unsubscribeHandler}
                  redirectToMemberPageHandler={redirectToMemberPageHandler}
                  likeMemberHandler={likeMemberHandler}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

BarberDetail.defaultProps = {
  initialReview: {
    page: 1,
    limit: 4,
    sort: "createdAt",
    direction: "ASC",
    search: {
      reviewRefId: "",
      reviewGroup: ReviewGroup.MEMBER,
    },
  },
};

export default withLayoutBasic(BarberDetail);
