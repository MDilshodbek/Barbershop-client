import React, { useState } from "react";
import {
  Stack,
  Box,
  Typography,
  IconButton,
  Backdrop,
  Button,
} from "@mui/material";
import Moment from "react-moment";
import { Review } from "../../types/review/review";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Messages, REACT_APP_API_URL } from "../../config";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import {
  sweetConfirmAlert,
  sweetMixinErrorAlert,
  sweetMixinSuccessAlert,
} from "../../sweetAlert";
import { ReviewStatus } from "../../enums/review.enum";

interface ReviewCardProps {
  fromMyPage?: string;
  review: Review;
  onRefetch?: () => Promise<void>;
  onUpdate?: (args: {
    reviewId: string;
    reviewContent?: string;
    reviewStatus?: ReviewStatus;
  }) => Promise<void>;
}
const ReviewCard = (props: ReviewCardProps) => {
  const { fromMyPage, review, onRefetch, onUpdate } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [updatedReview, setUpdatedReview] = useState<string>("");

  const updateButtonHandler = async (
    reviewId: string,
    reviewStatus?: ReviewStatus.DELETE
  ) => {
    try {
      if (!user._id) throw new Error(Messages.error2);
      if (!reviewId) throw new Error("Select a review to update!");
      if (updatedReview.trim() === review?.reviewContent) return;
      if (!onUpdate) throw new Error("Update handler not provided.");

      const payload = {
        reviewId,
        ...(reviewStatus && { reviewStatus }),
        ...(updatedReview.trim() && { reviewContent: updatedReview.trim() }),
      };

      if (!payload.reviewContent && !payload.reviewStatus)
        throw new Error("Provide data to update your review!");

      if (reviewStatus) {
        if (await sweetConfirmAlert("Do you want to delete the review?")) {
          await onUpdate(payload);
          await sweetMixinSuccessAlert("Successfully deleted!");
        } else return;
      } else {
        await onUpdate(payload);
        await sweetMixinSuccessAlert("Successfully updated!");
      }
      if (onRefetch) await onRefetch();
    } catch (error: any) {
      await sweetMixinErrorAlert(error.message);
    } finally {
      setOpenBackdrop(false);
      setUpdatedReview("");
    }
  };

  const cancelButtonHandler = () => {
    setOpenBackdrop(false);
    setUpdatedReview("");
  };

  const updateReviewInputHandler = (value: string) => {
    setUpdatedReview(value);
  };

  const imagePath: string = review?.memberData?.memberImage
    ? `${REACT_APP_API_URL}/${review?.memberData?.memberImage}`
    : "/logo/defaultUser.svg";

  if (null === "mobile") {
    return <div>REVIEW CARD</div>;
  } else {
    return (
      <Box component={"div"} className={"review-card"}>
        <div className={"info"}>
          <div className={"left"}>
            <img src={imagePath} alt="" />
            <div>
              <strong>{review.memberData?.memberNick}</strong>
              <span>
                <Moment format={"DD MMMM"}>{review.createdAt}</Moment>
              </span>
            </div>
          </div>
          {review?.memberId === user?._id && (
            <Stack direction={"row"}>
              <IconButton
                onClick={() => {
                  updateButtonHandler(review?._id, ReviewStatus.DELETE);
                }}
              >
                <DeleteForeverIcon
                  sx={{ color: "#757575", cursor: "pointer" }}
                />
              </IconButton>
              <IconButton
                onClick={(e: any) => {
                  setUpdatedReview(review?.reviewContent ?? "");
                  setOpenBackdrop(true);
                }}
              >
                <EditIcon sx={{ color: "#757575" }} />
              </IconButton>
              <Backdrop
                sx={{
                  top: "40%",
                  right: "25%",
                  left: "25%",
                  width: "1000px",
                  height: "fit-content",
                  borderRadius: "10px",
                  color: "#ffffff",
                  zIndex: 999,
                }}
                open={openBackdrop}
              >
                <Stack
                  sx={{
                    width: "100%",
                    height: "100%",
                    background: "white",
                    border: "1px solid #b9b9b9",
                    padding: "15px",
                    gap: "10px",
                    borderRadius: "10px",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                >
                  <Typography variant="h4" color={"#b9b9b9"}>
                    Update review
                  </Typography>
                  <Stack gap={"20px"}>
                    <input
                      autoFocus
                      value={updatedReview}
                      onChange={(e) => updateReviewInputHandler(e.target.value)}
                      type="text"
                      style={{
                        border: "1px solid #b9b9b9",
                        outline: "none",
                        height: "40px",
                        padding: "0px 10px",
                        borderRadius: "5px",
                      }}
                    />
                    <Stack
                      width={"100%"}
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                    >
                      <Stack
                        sx={{
                          flexDirection: "row",
                          alignSelf: "flex-end",
                          gap: "10px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={() => cancelButtonHandler()}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={() =>
                            updateButtonHandler(review?._id, undefined)
                          }
                        >
                          Update
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Backdrop>
            </Stack>
          )}
        </div>
        <p>{review.reviewContent}</p>

        {/* {fromMyPage && (
          <Stack className="reply-button-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clipPath="url(#clip0_7037_6550)">
                <path
                  d="M6.66667 4.67077V1.8361C6.66667 1.63544 6.546 1.4541 6.36133 1.37544C6.17733 1.29744 5.962 1.33677 5.81867 1.47744L0.152 6.97744C0.0546667 7.07144 0 7.20077 0 7.3361C0 7.47144 0.0546667 7.60077 0.152 7.69477L5.81867 13.1948C5.96333 13.3348 6.178 13.3741 6.36133 13.2968C6.546 13.2181 6.66667 13.0368 6.66667 12.8361V10.0028H7.612C10.7027 10.0028 13.552 11.6828 15.0473 14.3841L15.0613 14.4094C15.1507 14.5721 15.32 14.6694 15.5 14.6694C15.5413 14.6694 15.5827 14.6648 15.624 14.6541C15.8453 14.5974 16 14.3981 16 14.1694C16 8.98677 11.8287 4.7601 6.66667 4.67077Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_7037_6550">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <Typography className="reply-text">Reply</Typography>
          </Stack>
        )} */}
      </Box>
    );
  }
};

export default ReviewCard;
