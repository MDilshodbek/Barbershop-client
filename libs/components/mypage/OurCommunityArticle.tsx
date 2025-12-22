import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { Box, Stack, MenuItem } from "@mui/material";
import { List, ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import { TabContext } from "@mui/lab";
import { AllBoardArticlesInquiry } from "../../../libs/types/board-article/board-article.input";
import { BoardArticle } from "../../../libs/types/board-article/board-article";
import {
  BoardArticleCategory,
  BoardArticleStatus,
} from "../../../libs/enums/board-article.enum";
import {
  sweetConfirmAlert,
  sweetErrorHandling,
} from "../../../libs/sweetAlert";
import { BoardArticleUpdate } from "../../../libs/types/board-article/board-article.update";
import { useMutation, useQuery } from "@apollo/client";
import {
  REMOVE_BOARD_ARTICLE_BY_ADMIN,
  UPDATE_BOARD_ARTICLE_BY_ADMIN,
} from "../../../apollo/admin/mutation";
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from "../../../apollo/admin/query";
import { T } from "../../../libs/types/common";
import OurArticleList from "../common/ArticleList";

const OurCommunityArticle: NextPage = ({ initialInquiry, ...props }: any) => {
  const [anchorEl, setAnchorEl] = useState<any>([]);
  const [communityInquiry, setCommunityInquiry] =
    useState<AllBoardArticlesInquiry>(initialInquiry);
  const [articles, setArticles] = useState<BoardArticle[]>([]);
  const [articleTotal, setArticleTotal] = useState<number>(0);
  const [value, setValue] = useState(
    communityInquiry?.search?.articleStatus
      ? communityInquiry?.search?.articleStatus
      : "ALL"
  );
  const [searchType, setSearchType] = useState("ALL");

  /** APOLLO REQUESTS **/
  const [updateBoardArticleByAdmin] = useMutation(
    UPDATE_BOARD_ARTICLE_BY_ADMIN
  );
  const [removeBoardArticleByAdmin] = useMutation(
    REMOVE_BOARD_ARTICLE_BY_ADMIN
  );

  const {
    loading: getAllBoardArticlesByAdminLoading,
    data: getAllBoardArticlesByAdminData,
    error: getAllBoardArticlesByAdminError,
    refetch: getAllBoardArticlesByAdminRefetch,
  } = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: communityInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setArticles(data?.getAllBoardArticlesByAdmin?.list);
      setArticleTotal(
        data?.getAllBoardArticlesByAdmin?.metaCounter[0]?.total ?? 0
      );
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getAllBoardArticlesByAdminRefetch({ input: communityInquiry }).then();
  }, [communityInquiry]);

  /** HANDLERS **/
  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };

  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    setCommunityInquiry({ ...communityInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
      case "ACTIVE":
        setCommunityInquiry({
          ...communityInquiry,
          search: { articleStatus: BoardArticleStatus.ACTIVE },
        });
        break;
      case "DELETE":
        setCommunityInquiry({
          ...communityInquiry,
          search: { articleStatus: BoardArticleStatus.DELETE },
        });
        break;
      default:
        delete communityInquiry?.search?.articleStatus;
        setCommunityInquiry({ ...communityInquiry });
        break;
    }
  };

  const searchTypeHandler = async (newValue: string) => {
    try {
      setSearchType(newValue);

      if (newValue !== "ALL") {
        setCommunityInquiry({
          ...communityInquiry,
          page: 1,
          sort: "createdAt",
          search: {
            ...communityInquiry.search,
            articleCategory: newValue as BoardArticleCategory,
          },
        });
      } else {
        delete communityInquiry?.search?.articleCategory;
        setCommunityInquiry({ ...communityInquiry });
      }
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };

  const updateArticleHandler = async (updateData: BoardArticleUpdate) => {
    try {
      console.log("+updateData: ", updateData);
      await updateBoardArticleByAdmin({
        variables: {
          input: updateData,
        },
      });

      menuIconCloseHandler();
      await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  const removeArticleHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert("Are you sure to remove?")) {
        await removeBoardArticleByAdmin({
          variables: {
            input: id,
          },
        });

        await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
      }
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  console.log("+communityInquiry", communityInquiry);
  console.log("+articles", articles);

  return (
    <Box className={"service-list"}>
      <Typography variant={"h2"} className={"tit"} sx={{ mb: "24px" }}>
        Article List
      </Typography>
      <Box component={"div"} className={"table-wrap"}>
        <Box component={"div"} sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box component={"div"}>
              <List className={"tab-menu"}>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "ALL")}
                  value="ALL"
                  className={value === "ALL" ? "li on" : "li"}
                >
                  All
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "ACTIVE")}
                  value="ACTIVE"
                  className={value === "ACTIVE" ? "li on" : "li"}
                >
                  Active
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, "DELETE")}
                  value="DELETE"
                  className={value === "DELETE" ? "li on" : "li"}
                >
                  Delete
                </ListItem>
              </List>
              <Divider />
              <Stack className={"search-area"} sx={{ m: "24px" }}>
                <Select sx={{ width: "160px", mr: "20px" }} value={searchType}>
                  <MenuItem
                    value={"ALL"}
                    onClick={() => searchTypeHandler("ALL")}
                  >
                    ALL
                  </MenuItem>
                  {Object.values(BoardArticleCategory).map(
                    (category: string) => (
                      <MenuItem
                        value={category}
                        onClick={() => searchTypeHandler(category)}
                        key={category}
                      >
                        {category}
                      </MenuItem>
                    )
                  )}
                </Select>
              </Stack>
              <Divider />
            </Box>
            <OurArticleList
              articles={articles}
              anchorEl={anchorEl}
              menuIconClickHandler={menuIconClickHandler}
              menuIconCloseHandler={menuIconCloseHandler}
              updateArticleHandler={updateArticleHandler}
              removeArticleHandler={removeArticleHandler}
            />
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
};

OurCommunityArticle.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 10,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default OurCommunityArticle
