import React, { useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Pagination, Stack, Typography } from "@mui/material";
import CommunityCard from "../common/CommunityCard";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { T } from "../../types/common";
import { BoardArticle } from "../../types/board-article/board-article";
import { GET_ARTICLES } from "../../../apollo/user/query";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const MyArticles: NextPage = ({ initialInput, ...props }: T) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const [searchCommunity, setSearchCommunity] = useState({
    ...initialInput,
    search: { memberId: user._id },
  });
  const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  /** APOLLO REQUESTS **/
  const {
    loading: boardArticlesLoading,
    data: boardArticlesData,
    error: boardArticlesError,
    refetch: boardArticlesRefetch,
  } = useQuery(GET_ARTICLES, {
    fetchPolicy: "network-only",
    variables: { input: searchCommunity },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBoardArticles(data?.getBoardArticles?.list);
      setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
    },
  });

  /** HANDLERS **/

  const paginationHandler = (e: T, value: number) => {
    setSearchCommunity({ ...searchCommunity, page: value });
  };

  if (device === "mobile") {
    return <>ARTICLE PAGE MOBILE</>;
  } else
    return (
      <div id="my-articles-page">
        <Stack className="article-list-box">
          {boardArticles?.length > 0 ? (
            boardArticles?.map((boardArticle: BoardArticle) => {
              return (
                <CommunityCard
                  boardArticle={boardArticle}
                  key={boardArticle?._id}
                />
              );
            })
          ) : (
            <div className={"no-data"}>
              <InfoOutlinedIcon className="info-icon" />
              <p>No articles found!</p>
            </div>
          )}
        </Stack>

        {boardArticles?.length > 0 && (
          <Stack className="pagination-conf">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(totalCount / searchCommunity.limit)}
                page={searchCommunity.page}
                shape="circular"
                onChange={paginationHandler}
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
            <Stack className="total">
              <Typography>
                Total {totalCount} article{totalCount === 0 ? "" : "s"}{" "}
                available
              </Typography>
            </Stack>
          </Stack>
        )}
      </div>
    );
};

MyArticles.defaultProps = {
  initialInput: {
    page: 1,
    limit: 4,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default MyArticles;
