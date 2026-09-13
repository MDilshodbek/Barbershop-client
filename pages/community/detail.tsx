import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import {
  Button,
  Stack,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Backdrop,
  Pagination,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import Moment from "react-moment";
import { userVar } from "../../apollo/store";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import {
  CommentInput,
  CommentsInquiry,
} from "../../libs/types/comment/comment.input";
import { Comment } from "../../libs/types/comment/comment";
import dynamic from "next/dynamic";
import { CommentGroup, CommentStatus } from "../../libs/enums/comment.enum";
import { T } from "../../libs/types/common";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BoardArticle } from "../../libs/types/board-article/board-article";
import { CREATE_COMMENT, UPDATE_COMMENT } from "../../apollo/user/mutation";
import { GET_BOARD_ARTICLE, GET_COMMENTS } from "../../apollo/user/query";
import { Messages } from "../../libs/config";
import {
  sweetConfirmAlert,
  sweetMixinErrorAlert,
  sweetMixinSuccessAlert,
} from "../../libs/sweetAlert";
import { CommentUpdate } from "../../libs/types/comment/comment.update";
import { useTranslation } from "react-i18next";
const ToastViewerComponent = dynamic(
  () => import("../../libs/components/community/TViewer"),
  { ssr: false }
);

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
  const { t, i18n } = useTranslation("common");
  const device = useDeviceDetect();
  const router = useRouter();
  const { query } = router;
  const articleId = query?.id as string;
  const articleCategory = query?.articleCategory as string;
  const [comment, setComment] = useState<string>("");
  const [wordsCnt, setWordsCnt] = useState<number>(0);
  const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] =
    useState<number>(0);
  const user = useReactiveVar(userVar);
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
    ...initialInput,
  });
  const [memberImage, setMemberImage] = useState<string>(
    "/img/community/articleImg.png"
  );
  const [anchorEl, setAnchorEl] = useState<any | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [updatedComment, setUpdatedComment] = useState<string>("");
  const [updatedCommentId, setUpdatedCommentId] = useState<string>("");
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [boardArticle, setBoardArticle] = useState<BoardArticle>();

  /** APOLLO REQUESTS **/
  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);

  const {
    loading: boardArticleLoading,
    data: boardArticleData,
    error: boardArticleError,
    refetch: boardArticleRefetch,
  } = useQuery(GET_BOARD_ARTICLE, {
    fetchPolicy: "network-only",
    variables: { input: articleId },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setBoardArticle(data?.getBoardArticle);
      if (data?.getBoardArticle?.memberData?.memberImage) {
        setMemberImage(
          `${process.env.REACT_APP_API_URL}/${data?.getBoardArticle?.memberData?.memberImage}`
        );
      }
    },
  });

  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: searchFilter,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setComments(data.getComments?.list);
      setTotal(data?.getComments?.metaCounter?.[0]?.total || 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (articleId)
      setSearchFilter({
        ...searchFilter,
        search: { commentTargetId: articleId },
      });
  }, [articleId]);

  /** HANDLERS **/

  const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
    router.replace(
      {
        pathname: "/community",
        query: { articleCategory: value },
      },
      "/community",
      { shallow: true }
    );
  };

  const creteCommentHandler = async () => {
    if (!comment) return;
    try {
      if (!user?._id) throw new Error(Messages.error2);
      const commentInput: CommentInput = {
        commentGroup: CommentGroup.ARTICLE,
        commentTargetId: articleId,
        commentContent: comment,
      };
      await createComment({
        variables: { input: commentInput },
      });
      await getCommentsRefetch({ input: searchFilter });
      await boardArticleRefetch({ input: articleId });
      setComment("");
      await sweetMixinSuccessAlert(t("Successfully commented!"));
    } catch (error: any) {
      await sweetMixinErrorAlert(error.message);
    }
  };

  const updateButtonHandler = async (
    commentId: string,
    commentStatus?: CommentStatus.DELETE
  ) => {
    try {
      if (!user._id) throw new Error(Messages.error2);
      if (!commentId) throw new Error(t("Select a comment to update!"));
      if (
        updatedComment ===
        comments?.find((comment) => comment?._id === commentId)?.commentContent
      )
        return;

      const updateData: CommentUpdate = {
        _id: commentId,
        commentTargetId: articleId,
        ...(commentStatus && { commentStatus: commentStatus }),
        ...(updatedComment && { commentContent: updatedComment }),
      };

      if (!updateData?.commentContent && !updateData?.commentStatus)
        throw new Error(t("Provide data to update your comment!"));

      if (commentStatus) {
        if (await sweetConfirmAlert(t("Do you want to delete the comment?"))) {
          await updateComment({
            variables: {
              input: updateData,
            },
          });
          await sweetMixinSuccessAlert(t("Successfully deleted!"));
        } else return;
      } else {
        await updateComment({
          variables: {
            input: updateData,
          },
        });
        await sweetMixinSuccessAlert(t("Successfully updated!"));
      }
      await getCommentsRefetch({ input: searchFilter });
    } catch (error: any) {
      await sweetMixinErrorAlert(error.message);
    } finally {
      setOpenBackdrop(false);
      setUpdatedComment("");
      setUpdatedCommentWordsCnt(0);
      setUpdatedCommentId("");
    }
  };

  const getCommentMemberImage = (imageUrl: string | undefined) => {
    if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
    else return "/logo/defaultUser.svg";
  };

  const goMemberPage = (id: any) => {
    if (id === user?._id) router.push("/mypage");
    else router.push(`/member?memberId=${id}`);
  };

  const cancelButtonHandler = () => {
    setOpenBackdrop(false);
    setUpdatedComment("");
    setUpdatedCommentWordsCnt(0);
  };

  const updateCommentInputHandler = (value: string) => {
    if (value.length > 100) return;
    setUpdatedCommentWordsCnt(value.length);
    setUpdatedComment(value);
  };

  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  if (device === "mobile") {
    return (
      <div id="community-detail-page-mobile">
        <Typography className="hero-title">{t("Community Detail")}</Typography>
        <div className="container">
          <Stack className="community-header-mobile">
            <img src={"/logo/Logo.svg"} alt="" className="community-logo" />
            <span className="community-name">
              {t("Community Board Article")}
            </span>
          </Stack>

          <Tabs
            className="tabs-mobile"
            aria-label={t("Board categories")}
            TabIndicatorProps={{ style: { display: "none" } }}
            onChange={tabChangeHandler}
            value={articleCategory}
            variant="scrollable"
            scrollButtons={false}
          >
            <Tab
              value={"FREE"}
              label={t("Free Board")}
              className={`tab-button-mobile ${
                articleCategory === "FREE" ? "active" : ""
              }`}
            />
            <Tab
              value={"LIFESTYLE"}
              label={t("Lifestyle")}
              className={`tab-button-mobile ${
                articleCategory === "LIFESTYLE" ? "active" : ""
              }`}
            />
            <Tab
              value={"NEWS"}
              label={t("News")}
              className={`tab-button-mobile ${
                articleCategory === "NEWS" ? "active" : ""
              }`}
            />
          </Tabs>

          <div className="community-detail-config-mobile">
            <Stack className="article-card-mobile">
              <Typography className="content-data">
                {boardArticle?.articleTitle}
              </Typography>
              <Stack className="member-info">
                <img
                  src={memberImage}
                  alt=""
                  className="member-img"
                  onClick={() => goMemberPage(boardArticle?.memberData?._id)}
                />
                <Typography
                  className="member-nick"
                  onClick={() => goMemberPage(boardArticle?.memberData?._id)}
                >
                  {boardArticle?.memberData?.memberNick}
                </Typography>
                <Moment className={"time-added"} format={"DD.MM.YY HH:mm"}>
                  {boardArticle?.createdAt}
                </Moment>
              </Stack>
              <Stack className="info">
                <Stack className="icon-info">
                  <VisibilityIcon />
                  <span>{boardArticle?.articleViews}</span>
                </Stack>
                <Stack className="icon-info">
                  <CommentIcon />
                  <span>{total}</span>
                </Stack>
              </Stack>
              <ToastViewerComponent
                markdown={boardArticle?.articleContent}
                className={"ytb_play"}
              />
            </Stack>

            <Stack className="comment-form-mobile">
              <Typography className="title-text">
                {t("Comments")} ({total})
              </Typography>
              <input
                type="text"
                placeholder={t("Leave a comment")}
                value={comment}
                onChange={(e) => {
                  if (e.target.value.length > 100) return;
                  setWordsCnt(e.target.value.length);
                  setComment(e.target.value);
                }}
              />
              <Stack className="button-box">
                <span>{wordsCnt}/100</span>
                <Button onClick={creteCommentHandler}>{t("comment")}</Button>
              </Stack>
            </Stack>

            <Stack className="comments-list-mobile">
              {comments?.map((commentData) => {
                return (
                  <Stack className="comment-card-mobile" key={commentData?._id}>
                    <Stack
                      className="name-date"
                      onClick={() =>
                        goMemberPage(commentData?.memberData?._id as string)
                      }
                    >
                      <img
                        src={getCommentMemberImage(
                          commentData?.memberData?.memberImage
                        )}
                        alt=""
                      />
                      <Stack className="name-date-column">
                        <span className="name">
                          {commentData?.memberData?.memberNick}
                        </span>
                        <span className="date">
                          <Moment
                            className={"time-added"}
                            format={"DD.MM.YY HH:mm"}
                          >
                            {commentData?.createdAt}
                          </Moment>
                        </span>
                      </Stack>
                      {commentData?.memberId === user?._id && (
                        <Stack
                          className="buttons"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconButton
                            onClick={() => {
                              setUpdatedCommentId(commentData?._id);
                              updateButtonHandler(
                                commentData?._id,
                                CommentStatus.DELETE
                              );
                            }}
                          >
                            <DeleteForeverIcon
                              sx={{ color: "#757575", cursor: "pointer" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setUpdatedComment(commentData?.commentContent);
                              setUpdatedCommentWordsCnt(
                                commentData?.commentContent?.length
                              );
                              setUpdatedCommentId(commentData?._id);
                              setOpenBackdrop(true);
                            }}
                          >
                            <EditIcon sx={{ color: "#757575" }} />
                          </IconButton>
                        </Stack>
                      )}
                    </Stack>
                    <p className="comment-content">
                      {commentData?.commentContent}
                    </p>
                  </Stack>
                );
              })}
            </Stack>

            {total > 0 && (
              <Stack className="pagination-config-mobile">
                <Pagination
                  count={Math.ceil(total / searchFilter.limit) || 1}
                  page={searchFilter.page}
                  shape="circular"
                  size="small"
                  onChange={paginationHandler}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#004034",
                      borderColor: "#004034",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#C6D984",
                      color: "#fff",
                    },
                  }}
                />
              </Stack>
            )}
          </div>

          <Backdrop
            sx={{
              top: "auto",
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              height: "fit-content",
              borderRadius: "16px 16px 0 0",
              color: "#ffffff",
              zIndex: 999,
            }}
            open={openBackdrop}
          >
            <Stack className="edit-comment-sheet-mobile">
              <Typography variant="h4" color={"#b9b9b9"}>
                {t("Update comment")}
              </Typography>
              <input
                autoFocus
                value={updatedComment}
                onChange={(e) => updateCommentInputHandler(e.target.value)}
                type="text"
              />
              <Stack className="edit-comment-footer-mobile">
                <span>{updatedCommentWordsCnt}/100</span>
                <Stack className="edit-comment-actions-mobile">
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => cancelButtonHandler()}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={() =>
                      updateButtonHandler(updatedCommentId, undefined)
                    }
                  >
                    {t("Update")}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Backdrop>
        </div>
      </div>
    );
  } else {
    return (
      <div id="community-detail-page">
        <Typography className="hero-title">{t("Community Detail")}</Typography>
        <div className="container">
          <Stack className="main-box">
            <Stack className="left-config">
              <Stack className={"image-info"}>
                <img src={"/logo/Logo.svg"} />
                <Stack className={"community-name"}>
                  <Typography className={"name"}>
                    {t("Community Board Article")}
                  </Typography>
                </Stack>
              </Stack>
              <Tabs
                orientation="vertical"
                aria-label={t("Board categories")}
                TabIndicatorProps={{
                  style: { display: "none" },
                }}
                onChange={tabChangeHandler}
                value={articleCategory}
              >
                <Tab
                  value={"FREE"}
                  label={t("Free Board")}
                  className={`tab-button ${
                    articleCategory === "FREE" ? "active" : ""
                  }`}
                />
                <Tab
                  value={"LIFESTYLE"}
                  label={t("Lifestyle")}
                  className={`tab-button ${
                    articleCategory === "LIFESTYLE" ? "active" : ""
                  }`}
                />
                <Tab
                  value={"NEWS"}
                  label={t("News")}
                  className={`tab-button ${
                    articleCategory === "NEWS" ? "active" : ""
                  }`}
                />
              </Tabs>
            </Stack>
            <div className="community-detail-config">
              <Stack className="title-box">
                <Stack className="left">
                  <Typography className="title">
                    {articleCategory} {t("BOARD")}
                  </Typography>
                  <Typography className="sub-title">
                    {t("Express your opinions freely here without content restrictions")}
                  </Typography>
                </Stack>
                <Button
                  onClick={() =>
                    router.push({
                      pathname: "/mypage",
                      query: {
                        category: "writeArticle",
                      },
                    })
                  }
                  className="right"
                >
                  {t("Write")}
                </Button>
              </Stack>
              <div className="config">
                <Stack className="first-box-config">
                  <Stack className="content-and-info">
                    <Stack className="content">
                      <Typography className="content-data">
                        {boardArticle?.articleTitle}
                      </Typography>
                      <Stack className="member-info">
                        <img
                          src={memberImage}
                          alt=""
                          className="member-img"
                          onClick={() =>
                            goMemberPage(boardArticle?.memberData?._id)
                          }
                        />
                        <Typography
                          className="member-nick"
                          onClick={() =>
                            goMemberPage(boardArticle?.memberData?._id)
                          }
                        >
                          {boardArticle?.memberData?.memberNick}
                        </Typography>
                        <Stack className="divider"></Stack>
                        <Moment
                          className={"time-added"}
                          format={"DD.MM.YY HH:mm"}
                        >
                          {boardArticle?.createdAt}
                        </Moment>
                      </Stack>
                    </Stack>
                    <Stack className="info">
                      <Stack className="icon-info">
                        <VisibilityIcon />
                        <Typography className="text">
                          {boardArticle?.articleViews}
                        </Typography>
                      </Stack>
                      <Stack className="divider"></Stack>
                      <Stack className="icon-info">
                        <CommentIcon />
                        <Typography className="text">{total}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack>
                    <ToastViewerComponent
                      markdown={boardArticle?.articleContent}
                      className={"ytb_play"}
                    />
                  </Stack>
                </Stack>
                <Stack
                  className="second-box-config"
                  sx={{
                    borderBottom: total > 0 ? "none" : "1px solid #eee",
                    border: "1px solid #eee",
                  }}
                >
                  <Typography className="title-text">
                    {t("Comments")} ({total})
                  </Typography>
                  <Stack className="leave-comment">
                    <input
                      type="text"
                      placeholder={t("Leave a comment")}
                      value={comment}
                      onChange={(e) => {
                        if (e.target.value.length > 100) return;
                        setWordsCnt(e.target.value.length);
                        setComment(e.target.value);
                      }}
                    />
                    <Stack className="button-box">
                      <Typography>{wordsCnt}/100</Typography>
                      <Button onClick={creteCommentHandler}>{t("comment")}</Button>
                    </Stack>
                  </Stack>
                </Stack>
                {total > 0 && (
                  <Stack className="comments">
                    <Typography className="comments-title">{t("Comments")}</Typography>
                  </Stack>
                )}
                {comments?.map((commentData, index) => {
                  return (
                    <Stack className="comments-box" key={commentData?._id}>
                      <Stack className="main-comment">
                        <Stack className="member-info">
                          <Stack
                            className="name-date"
                            onClick={() =>
                              goMemberPage(
                                commentData?.memberData?._id as string
                              )
                            }
                          >
                            <img
                              src={getCommentMemberImage(
                                commentData?.memberData?.memberImage
                              )}
                              alt=""
                            />
                            <Stack className="name-date-column">
                              <Typography className="name">
                                {commentData?.memberData?.memberNick}
                              </Typography>
                              <Typography className="date">
                                <Moment
                                  className={"time-added"}
                                  format={"DD.MM.YY HH:mm"}
                                >
                                  {commentData?.createdAt}
                                </Moment>
                              </Typography>
                            </Stack>
                          </Stack>
                          {commentData?.memberId === user?._id && (
                            <Stack className="buttons">
                              <IconButton
                                onClick={() => {
                                  setUpdatedCommentId(commentData?._id);
                                  updateButtonHandler(
                                    commentData?._id,
                                    CommentStatus.DELETE
                                  );
                                }}
                              >
                                <DeleteForeverIcon
                                  sx={{ color: "#757575", cursor: "pointer" }}
                                />
                              </IconButton>
                              <IconButton
                                onClick={(e: any) => {
                                  setUpdatedComment(
                                    commentData?.commentContent
                                  );
                                  setUpdatedCommentWordsCnt(
                                    commentData?.commentContent?.length
                                  );
                                  setUpdatedCommentId(commentData?._id);
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
                                    boxShadow:
                                      "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                  }}
                                >
                                  <Typography variant="h4" color={"#b9b9b9"}>
                                    {t("Update comment")}
                                  </Typography>
                                  <Stack gap={"20px"}>
                                    <input
                                      autoFocus
                                      value={updatedComment}
                                      onChange={(e) =>
                                        updateCommentInputHandler(
                                          e.target.value
                                        )
                                      }
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
                                      <Typography
                                        variant="subtitle1"
                                        color={"#b9b9b9"}
                                      >
                                        {updatedCommentWordsCnt}/100
                                      </Typography>
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
                                          {t("Cancel")}
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="inherit"
                                          onClick={() =>
                                            updateButtonHandler(
                                              updatedCommentId,
                                              undefined
                                            )
                                          }
                                        >
                                          {t("Update")}
                                        </Button>
                                      </Stack>
                                    </Stack>
                                  </Stack>
                                </Stack>
                              </Backdrop>
                            </Stack>
                          )}
                        </Stack>
                        <Stack className="content">
                          <Typography>{commentData?.commentContent}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  );
                })}
                {total > 0 && (
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
                )}
              </div>
            </div>
          </Stack>
        </div>
      </div>
    );
  }
};
CommunityDetail.defaultProps = {
  initialInput: {
    page: 1,
    limit: 4,
    sort: "createdAt",
    direction: "DESC",
    search: { commentTargetId: "" },
  },
};

export default withLayoutBasic(CommunityDetail);
