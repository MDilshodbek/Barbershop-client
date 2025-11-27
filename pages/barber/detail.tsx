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
import { useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import StarIcon from "@mui/icons-material/Star";
import ReviewCard from "../../libs/components/agent/ReviewCard";

const BarberDetail: NextPage = () => {
  const [value, setValue] = useState<number | null>(2);

  return (
    <Stack className="bdetail-page">
      <Typography className="hero-title">Barber Page</Typography>
      <Stack className="container">
        <Stack className="barber-detail-main">
          <Stack className="bdetail-box">
            <Box>
              <img src="/img/barber3.png" alt="" />
            </Box>
            <Stack className="bdetail-info">
              <Typography className="barber-name">Dominik Rossi</Typography>
              <Stack className="barber-level">
                <Typography className="barber-level1">Level:</Typography>
                <Typography className="barber-level2">Senior</Typography>
              </Stack>
              <Typography className="barber-desc">
                With over 25 years of experience, Dominick Rossi is a true
                master in the art of classic barbering. His skilled hands
                expertly blend time-honored techniques with a contemporary
                aesthetic, reinterpreting iconic cuts for the modern gentleman.
              </Typography>
              <Stack className="breview-box">
                <Rating
                  className="review-starts"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
                <Typography className="breview-number">10 reviews</Typography>
              </Stack>
              <Stack className="blike-box">
                <Box className="barber-like">
                  <IconButton color={"default"}>
                    <FavoriteBorderIcon
                      style={{
                        color: "#004034",
                        fontSize: "30px",
                      }}
                    />
                  </IconButton>
                  <Typography className="view-cnt">10</Typography>
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
                  <Typography className="view-cnt">10</Typography>
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

            <Stack className={"review-wrap"}>
              <Box component={"div"} className={"title-box"}>
                <StarIcon />
                <span>Total review 1</span>
              </Box>
              <ReviewCard />;
              <Box component={"div"} className={"pagination-box"}>
                <Pagination
                  page={1}
                  // count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
                  // onChange={commentPaginationChangeHandler}
                  shape="circular"
                  color="primary"
                />
              </Box>
            </Stack>

            <Stack className={"leave-review-config"}>
              <Typography className={"main-title"}>Leave A Review</Typography>
              <Typography className={"review-title"}>Review</Typography>
              <textarea
                onChange={({ target: { value } }: any) => {
                  // setInsertCommentData({
                  //   ...insertCommentData,
                  //   commentContent: value,
                  // });
                }}
                // value={insertCommentData.commentContent}
              ></textarea>
              <Box className={"submit-btn"} component={"div"}>
                <Button
                  className={"submit-review"}
                  disabled={
                    true
                    // insertCommentData.commentContent === "" || user?._id === ""
                  }
                  // onClick={createCommentHandler}
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
};

export default withLayoutBasic(BarberDetail);
