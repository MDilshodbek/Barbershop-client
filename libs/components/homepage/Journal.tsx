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

interface NewArticlesProps {
  initialInput: BoardArticlesInquiry;
}

const Journal = (props: NewArticlesProps) => {
  const [article, setArticle] = useState<BoardArticle[]>([]);
  const { initialInput } = props;

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
                      <img
                      className="journal-images"
                        src={
                          article?.articleImage
                            ? `${process.env.REACT_APP_API_URL}/${article?.articleImage[0]}`
                            : "/logo/Logo.svg"
                        }
                        alt=""
                      />
                      <Box className="journal-category-title">
                        {article.articleCategory}
                      </Box>
                    </Stack>
                    <Stack className="journal-title">
                      {article.articleTitle}
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
