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
import { BarbersInquiry } from "../../libs/types/member/member.input";
import {
  ReviewInput,
  ReviewInquiry,
} from "../../libs/types/review/review.input";
import { Review } from "../../libs/types/review/review";
import { ReviewGroup } from "../../libs/enums/review.enum";
import { CREATE_REVIEW, LIKE_BARBER } from "../../apollo/user/mutation";
import { Message } from "../../libs/enums/common.enum";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { T } from "../../libs/types/common";
import { GET_MEMBER, GET_REVIEWS } from "../../apollo/user/query";
import { Messages } from "../../libs/config";

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

  const [likeTargetMember] = useMutation(LIKE_BARBER);

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

  console.log("barberReviews:", barberReviews);

  const [createReview] = useMutation(CREATE_REVIEW);

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

      await createReview({ variables: { input: insertReviewData } });
      await getReviewsRefetch({ input: reviewInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
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
              </Stack>
            </Stack>
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
                    return <ReviewCard review={review} key={review?._id} />;
                  })}
                  <Box component={"div"} className={"pagination-box"}>
                    <Pagination
                      page={reviewInquiry.page}
                      count={Math.ceil(reviewTotal / reviewInquiry.limit) || 1}
                      onChange={reviewPaginationChangeHandler}
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
                  </Box>
                </Stack>
              )}

              <Stack className={"leave-review-config"}>
                <Typography className={"main-title"}>Leave A Review</Typography>
                <Typography className={"review-title"}>Review</Typography>
                <textarea
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
                      insertReviewData.reviewContent === "" || user?._id === ""
                    }
                    onClick={createReviewHandler}
                  >
                    <Typography className={"title"}>Submit Review</Typography>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_6975_3642)">
                        <path
                          d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
                          fill="#181A20"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6975_3642">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0.601562 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </Button>
                </Box>
              </Stack>
            </Stack>
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
