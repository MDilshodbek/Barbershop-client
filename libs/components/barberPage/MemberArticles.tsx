import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Pagination, Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useRouter } from "next/router";
import CommunityCard from "../common/CommunityCard";
import { T } from "../../types/common";
import { BoardArticle } from "../../types/board-article/board-article";
import { BoardArticlesInquiry } from "../../types/board-article/board-article.input";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ARTICLES } from "../../../apollo/user/query";
import { Messages } from "../../config";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";

const MemberArticles: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);
  const { memberId } = router.query;
  const [searchFilter, setSearchFilter] =
    useState<BoardArticlesInquiry>(initialInput);
  const [memberBoArticles, setMemberBoArticles] = useState<BoardArticle[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: boardArticlesLoading,
    data: boardArticlesData,
    error: boardArticlesError,
    refetch: boardArticlesRefetch,
  } = useQuery(GET_ARTICLES, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMemberBoArticles(data?.getBoardArticles?.list);
      setTotal(data?.getBoardArticles?.metaCounter?.[0]?.total || 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    const barberId = router.query.barberId as string | undefined;
    if (barberId)
      setSearchFilter({ ...initialInput, search: { memberId: barberId } });
  }, [router.query.barberId]);

  /** HANDLERS **/

  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  if (device === "mobile") {
    return <div>MEMBER ARTICLES MOBILE</div>;
  } else {
    return (
      <div id="member-articles-page">
        <Stack className="articles-list-box">
          {memberBoArticles?.length === 0 && (
            <div className={"no-data"}>
              <InfoOutlinedIcon className="info-icon" />
              <p>No Articles found!</p>
            </div>
          )}
          {memberBoArticles?.map((boardArticle: BoardArticle) => {
            return (
              <CommunityCard
                boardArticle={boardArticle}
                key={boardArticle?._id}
              />
            );
          })}
        </Stack>
        {memberBoArticles?.length !== 0 && (
          <Stack className="pagination-config">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(total / searchFilter.limit) || 1}
                page={searchFilter.page}
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
            <Stack className="total-result">
              <span>{total} article available</span>
            </Stack>
          </Stack>
        )}
      </div>
    );
  }
};

MemberArticles.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    sort: "createdAt",
    direction: "DESC",
    search: {
      memberId: "",
    },
  },
};

export default MemberArticles;
