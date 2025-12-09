import React from "react";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Box, Stack } from "@mui/material";
import { BoardArticle } from "../../types/board-article/board-article";
import { REACT_APP_API_URL } from "../../config";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface CommunityCardProps {
  boardArticle: BoardArticle;
}

const CommunityCard = (props: CommunityCardProps) => {
  const { boardArticle} = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const imagePath: string = boardArticle?.articleImage
    ? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
    : "/img/community/communityImg.png";

  /** HANDLERS **/
  const chooseArticleHandler = (
    e: React.SyntheticEvent,
    boardArticle: BoardArticle
  ) => {
    router.push(
      {
        pathname: "/community/detail",
        query: {
          articleCategory: boardArticle?.articleCategory,
          id: boardArticle?._id,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  if (device === "mobile") {
    return <div>COMMUNITY CARD MOBILE</div>;
  } else {
    return (
      <Stack key={boardArticle._id} className="journal-card">
        <Stack className="journal-category">
          <img
            className="journal-images"
            src={
              boardArticle?.articleImage
                ? `${process.env.REACT_APP_API_URL}/${boardArticle?.articleImage[0]}`
                : "/logo/Logo.svg"
            }
            alt=""
          />
          <Box className="journal-category-title">
            {boardArticle.articleCategory}
          </Box>
        </Stack>
        <Stack className="journal-title">{boardArticle.articleTitle}</Stack>
        <Stack className="journal-info">
          <Stack className="journal-date">
            <CalendarMonthIcon />
            <span>{new Date(boardArticle.createdAt).toLocaleDateString()}</span>
          </Stack>
          <Stack className="journal-comment">
            <CommentIcon />
            <span>{boardArticle.articleComments}</span>
          </Stack>
          <Stack className="journal-view">
            <VisibilityIcon />
            <span>{boardArticle.articleViews}</span>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default CommunityCard;
