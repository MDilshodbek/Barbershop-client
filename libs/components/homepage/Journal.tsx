import { Box, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { BoardArticle } from "../../types/board-article/board-article";
import { BoardArticlesInquiry } from "../../types/board-article/board-article.input";
import { useQuery } from "@apollo/client";
import { GET_ARTICLES } from "../../../apollo/user/query";
import { T } from "../../types/common";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import Link from "next/link";
SwiperCore.use([Autoplay, Pagination]);

interface NewArticlesProps {
  initialInput: BoardArticlesInquiry;
}

const Journal = (props: NewArticlesProps) => {
  const [article, setArticle] = useState<BoardArticle[]>([]);
  const { initialInput } = props;
  const device = useDeviceDetect();

  const {
    loading: getArticlesLoading,
    data: getArticlesData,
    error: getArticlesError,
    refetch: getArticlesRefetch,
  } = useQuery(GET_ARTICLES, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setArticle(data?.getBoardArticles?.list);
    },
  });

  if (device === "mobile") {
    return (
      <Stack className="journal journal-mobile">
        <Stack className="container">
          <Stack className="grooming-blog">The Grooming Blogs</Stack>
          <Stack className="blog-cards blog-cards-mobile">
            {article.length === 0 ? (
              <Box component={"div"} className="empty-list">
                Articles are not available
              </Box>
            ) : (
              article.map((article: BoardArticle) => {
                return (
                  <Stack key={article._id} className="journal-card">
                    <Stack className="journal-category">
                      <Link href="/community">
                        <img
                          className="journal-images"
                          src={
                            article?.articleImage
                              ? `${process.env.REACT_APP_API_URL}/${article?.articleImage[0]}`
                              : "/logo/Logo.svg"
                          }
                          alt=""
                        />
                      </Link>
                      <Box className="journal-category-title">
                        {article.articleCategory}
                      </Box>
                    </Stack>
                    <Stack className="journal-title">
                      <Link href="/community">{article.articleTitle}</Link>
                    </Stack>
                    <Stack className="journal-info">
                      <Stack className="journal-date">
                        <CalendarMonthIcon />
                        <span>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </Stack>
                      <Stack className="journal-comment">
                        <CommentIcon />
                        <span>{article.articleComments}</span>
                      </Stack>
                      <Stack className="journal-view">
                        <VisibilityIcon />
                        <span>{article.articleViews}</span>
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className="journal">
      <Stack className="container">
        <Stack className="grooming-blog">The Grooming Blogs</Stack>
        <Stack className="blog-cards">
          {article.length === 0 ? (
            <Box component={"div"} className="empty-list">
              Articles are not available
            </Box>
          ) : (
            <>
              {article.map((article: BoardArticle) => {
                return (
                  <Stack key={article._id} className="journal-card">
                    <Stack className="journal-category">
                      <Link href="/community">
                        <img
                          className="journal-images"
                          src={
                            article?.articleImage
                              ? `${process.env.REACT_APP_API_URL}/${article?.articleImage[0]}`
                              : "/logo/Logo.svg"
                          }
                          alt=""
                        />
                      </Link>
                      <Box className="journal-category-title">
                        {article.articleCategory}
                      </Box>
                    </Stack>
                    <Stack className="journal-title">
                      <Link href="/community">{article.articleTitle}</Link>
                    </Stack>
                    <Stack className="journal-info">
                      <Stack className="journal-date">
                        <CalendarMonthIcon />
                        <span>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </Stack>
                      <Stack className="journal-comment">
                        <CommentIcon />
                        <span>{article.articleComments}</span>
                      </Stack>
                      <Stack className="journal-view">
                        <VisibilityIcon />
                        <span>{article.articleViews}</span>
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

Journal.defaultProps = {
  initialInput: {
    page: 1,
    limit: 3,
    sort: "createdAt",
    search: {},
  },
};

export default Journal;
