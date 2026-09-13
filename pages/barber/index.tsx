import {
  Box,
  Button,
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import { BarbersInquiry } from "../../libs/types/member/member.input";
import { useEffect, useState, MouseEvent, ChangeEvent } from "react";
import { Member } from "../../libs/types/member/member";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { GET_BARBERS } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/router";
import { LIKE_TARGET_MEMBER } from "../../apollo/user/mutation";
import { Direction, Message } from "../../libs/enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Link from "next/link";
import { userVar } from "../../apollo/store";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

interface BarbersProps {
  initialInput: BarbersInquiry;
}

const Barber: NextPage<BarbersProps> = (props) => {
  const device = useDeviceDetect();
  const [barber, setBarber] = useState<Member[]>([]);
  const [filterSortName, setFilterSortName] = useState("Recent");
  const [sortingOpen, setSortingOpen] = useState(false);
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");

  const {
    initialInput = {
      page: 1,
      limit: 6,
      sort: "createdAt",
      search: {},
    },
  } = props;
  const [searchFilter, setSearchFilter] =
    useState<BarbersInquiry>(initialInput);

  // Apolo requests

  const {
    loading: getBarbersLoading,
    data: getBarbersData,
    error: getBarbersError,
    refetch: getBarbersRefetch,
  } = useQuery(GET_BARBERS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBarber(data?.getBarbers?.list);
      setTotal(data?.getBarbers?.metaCounter[0]?.total);
    },
  });

  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** LIFECYCLES **/
  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.input) {
      const input_obj = JSON.parse(router?.query?.input as string);
      setSearchFilter(input_obj);
      setCurrentPage(input_obj.page ?? 1);

      if (input_obj.sort === "createdAt") {
        if (input_obj.direction === Direction.ASC) {
          setFilterSortName("Oldest order");
        } else {
          setFilterSortName("Recent");
        }
      } else if (input_obj.sort === "memberLikes") {
        setFilterSortName("Likes");
      } else if (input_obj.sort === "memberRank") {
        setFilterSortName("Rank");
      } else if (input_obj.sort === "memberLevel") {
        setFilterSortName("Level");
      } else {
        setFilterSortName("Recent");
      }
    }
  }, [router.isReady, router.query.input]);

  // Handlers
  const likeMemberHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      // execute likeTargetProperty Mutation
      await likeTargetMember({ variables: { input: id } });

      // execute getPropertiesRefetch
      await getBarbersRefetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert(t("success"), 800);
    } catch (error: any) {
      sweetMixinErrorAlert(error.message).then();
    }
  };

  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    let nextFilter = { ...searchFilter };
    switch (e.currentTarget.id) {
      case "recent":
        nextFilter = {
          ...nextFilter,
          sort: "createdAt",
          direction: Direction.DESC,
        };
        setFilterSortName("Recent");
        break;
      case "old":
        nextFilter = {
          ...nextFilter,
          sort: "createdAt",
          direction: Direction.ASC,
        };
        setFilterSortName("Oldest order");
        break;
      case "likes":
        nextFilter = {
          ...nextFilter,
          sort: "memberLikes",
          direction: Direction.DESC,
        };
        setFilterSortName("Likes");
        break;
      case "rank":
        nextFilter = {
          ...nextFilter,
          sort: "memberRank",
          direction: Direction.DESC,
        };
        setFilterSortName("Rank");
        break;
      case "level":
        nextFilter = {
          ...nextFilter,
          sort: "memberLevel",
          direction: Direction.DESC,
        };
        setFilterSortName("Level");
        break;
    }
    setSearchFilter(nextFilter);

    const encoded = encodeURIComponent(JSON.stringify(nextFilter));
    router.replace(`/barber?input=${encoded}`, `/barber?input=${encoded}`, {
      scroll: false,
    });
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const paginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    const nextFilter = {
      ...searchFilter,
      page: value,
    };

    setSearchFilter(nextFilter);
    setCurrentPage(value);

    const encoded = encodeURIComponent(JSON.stringify(nextFilter));
    router.replace(`/barber?input=${encoded}`, `/barber?input=${encoded}`, {
      scroll: false,
    });
  };

  if (device === "mobile") {
    return (
      <Stack className="barber-page-mobile">
        <Typography className="hero-title">{t("Masters")}</Typography>
        <Stack className="container">
          <Stack className="barber-main-title">
            {t("Our Artistic Specialists")}
          </Stack>
          <Stack className={"filter"}>
            <OutlinedInput
              className="search-input"
              type="text"
              placeholder={t("Search for a barber")}
              value={searchText}
              onChange={(e: any) => setSearchText(e.target.value)}
              onKeyDown={(event: any) => {
                if (event.key == "Enter") {
                  const nextFilter = {
                    ...searchFilter,
                    page: 1,
                    search: {
                      ...searchFilter.search,
                      text: searchText,
                    },
                  };

                  setSearchFilter(nextFilter);
                  const encoded = encodeURIComponent(
                    JSON.stringify(nextFilter)
                  );
                  router.replace(
                    `/barber?input=${encoded}`,
                    `/barber?input=${encoded}`,
                    { scroll: false }
                  );
                }
              }}
              endAdornment={
                <CancelRoundedIcon
                  className="cancel-round"
                  onClick={() => {
                    setSearchText("");
                    setSearchFilter({
                      ...searchFilter,
                      search: { ...searchFilter.search, text: "" },
                    });
                  }}
                />
              }
            />
            <Stack className="sort-row">
              <span>{t("Sort by")}</span>
              <div>
                <Button
                  onClick={sortingClickHandler}
                  endIcon={<KeyboardArrowDownRoundedIcon />}
                >
                  {t(filterSortName)}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={sortingOpen}
                  onClose={sortingCloseHandler}
                  sx={{ paddingTop: "5px" }}
                >
                  <MenuItem onClick={sortingHandler} id={"recent"} disableRipple>
                    {t("Recent")}
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"old"} disableRipple>
                    {t("Oldest")}
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"likes"} disableRipple>
                    {t("Likes")}
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"rank"} disableRipple>
                    {t("Rank")}
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"level"} disableRipple>
                    {t("Level")}
                  </MenuItem>
                </Menu>
              </div>
            </Stack>
          </Stack>

          <Stack className="barber-box">
            {barber.length === 0 ? (
              <Box component={"div"} className="empty-list">
                {t("Barbers are not available")}
              </Box>
            ) : (
              <>
                {barber.map((barber: Member) => {
                  return (
                    <Stack key={barber._id} className="barber-info">
                      <Box className="barber-img">
                        <Link
                          href={{
                            pathname: "/barber/detail",
                            query: { barberId: barber?._id },
                          }}
                        >
                          <img
                            src={
                              barber?.memberImage
                                ? `${process.env.REACT_APP_API_URL}/${barber?.memberImage}`
                                : "/logo/defaultUser.svg"
                            }
                            alt=""
                          />
                        </Link>
                      </Box>
                      <Stack className="barber-info-col">
                        <Link
                          href={{
                            pathname: "/barber/detail",
                            query: { barberId: barber?._id },
                          }}
                        >
                          <Box className="barber-name">
                            {barber?.memberFullName ?? barber?.memberNick}
                          </Box>
                        </Link>
                        <Stack className="barber-media">
                          <Box
                            className="barber-like"
                            onClick={() => likeMemberHandler(user, barber?._id)}
                          >
                            {barber?.meLiked &&
                            barber?.meLiked[0]?.myFavorite ? (
                              <FavoriteIcon style={{ color: "red" }} />
                            ) : (
                              <FavoriteBorderIcon
                                style={{ color: "#004034" }}
                              />
                            )}
                            <span>{barber.memberLikes}</span>
                          </Box>
                          <Box className="barber-view">
                            <RemoveRedEyeIcon style={{ color: "#004034" }} />
                            <span>{barber.memberViews}</span>
                          </Box>
                          <Stack className="barber-socialmedia">
                            <FacebookOutlinedIcon
                              style={{ color: "#004034", cursor: "pointer" }}
                            />
                            <InstagramIcon
                              style={{ color: "#004034", cursor: "pointer" }}
                            />
                            <XIcon
                              style={{ color: "#004034", cursor: "pointer" }}
                            />
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  );
                })}
              </>
            )}
          </Stack>

          <Stack className={"pagination"}>
            {barber.length !== 0 &&
              Math.ceil(total / searchFilter.limit) > 1 && (
                <Pagination
                  page={searchFilter.page ?? 1}
                  count={Math.ceil(total / searchFilter.limit)}
                  onChange={paginationChangeHandler}
                  shape="circular"
                  size="small"
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
              )}
            {barber.length !== 0 && (
              <span>
                {t("Total")} {total}{" "}
                {total > 1 ? t("barbers") : t("barber")} {t("available")}
              </span>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className="barber-page">
        <Typography className="hero-title">{t("Masters")}</Typography>
        <Stack className="container">
          <Stack className="barber-main">
            <Stack className="barber-main-title">
              {t("Our Artistic Specialists")}
            </Stack>
            <Stack className={"filter"}>
              <Box component={"div"} className={"left"}>
                <OutlinedInput
                  className="search-input"
                  type="text"
                  placeholder={t("Search for a barber")}
                  value={searchText}
                  onChange={(e: any) => setSearchText(e.target.value)}
                  onKeyDown={(event: any) => {
                    if (event.key == "Enter") {
                      const nextFilter = {
                        ...searchFilter,
                        page: 1,
                        search: {
                          ...searchFilter.search,
                          text: searchText,
                        },
                      };

                      setSearchFilter(nextFilter);
                      const encoded = encodeURIComponent(
                        JSON.stringify(nextFilter)
                      );
                      router.replace(
                        `/barber?input=${encoded}`,
                        `/barber?input=${encoded}`,
                        { scroll: false }
                      );
                    }
                  }}
                  endAdornment={
                    <>
                      <CancelRoundedIcon
                        className="cancel-round"
                        onClick={() => {
                          setSearchText("");
                          setSearchFilter({
                            ...searchFilter,
                            search: { ...searchFilter.search, text: "" },
                          });
                        }}
                      />
                    </>
                  }
                />
              </Box>
              <Box component={"div"} className={"right"}>
                <span>{t("Sort by")}</span>
                <div>
                  <Button
                    onClick={sortingClickHandler}
                    endIcon={<KeyboardArrowDownRoundedIcon />}
                  >
                    {t(filterSortName)}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={sortingOpen}
                    onClose={sortingCloseHandler}
                    sx={{ paddingTop: "5px" }}
                  >
                    <MenuItem
                      onClick={sortingHandler}
                      id={"recent"}
                      disableRipple
                    >
                      {t("Recent")}
                    </MenuItem>
                    <MenuItem onClick={sortingHandler} id={"old"} disableRipple>
                      {t("Oldest")}
                    </MenuItem>
                    <MenuItem
                      onClick={sortingHandler}
                      id={"likes"}
                      disableRipple
                    >
                      {t("Likes")}
                    </MenuItem>
                    <MenuItem
                      onClick={sortingHandler}
                      id={"rank"}
                      disableRipple
                    >
                      {t("Rank")}
                    </MenuItem>
                    <MenuItem
                      onClick={sortingHandler}
                      id={"level"}
                      disableRipple
                    >
                      {t("Level")}
                    </MenuItem>
                  </Menu>
                </div>
              </Box>
            </Stack>
            <Stack className="barber-box">
              {barber.length === 0 ? (
                <Box component={"div"} className="empty-list">
                  {t("Barbers are not available")}
                </Box>
              ) : (
                <>
                  {barber.map((barber: Member) => {
                    return (
                      <Stack key={barber._id} className="barber-info">
                        <Box className="barber-img">
                          <Link
                            href={{
                              pathname: "/barber/detail",
                              query: { barberId: barber?._id },
                            }}
                          >
                            <img
                              src={
                                barber?.memberImage
                                  ? `${process.env.REACT_APP_API_URL}/${barber?.memberImage}`
                                  : "/logo/defaultUser.svg"
                              }
                              alt=""
                            />
                          </Link>
                        </Box>
                        <Link
                          href={{
                            pathname: "/barber/detail",
                            query: { barberId: barber?._id },
                          }}
                        >
                          <Box className="barber-name">
                            {barber?.memberFullName ?? barber?.memberNick}
                          </Box>
                        </Link>
                        <Stack className="barber-media">
                          <Box
                            className="barber-like"
                            onClick={() => likeMemberHandler(user, barber?._id)}
                          >
                            {barber?.meLiked &&
                            barber?.meLiked[0]?.myFavorite ? (
                              <FavoriteIcon style={{ color: "red" }} />
                            ) : (
                              <FavoriteBorderIcon
                                style={{ color: "#004034" }}
                              />
                            )}
                            <span>{barber.memberLikes}</span>
                          </Box>
                          <Stack className="barber-socialmedia">
                            <FacebookOutlinedIcon
                              style={{
                                color: "#004034",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                            />
                            <InstagramIcon
                              style={{
                                color: "#004034",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                            />
                            <XIcon
                              style={{
                                color: "#004034",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                            />
                          </Stack>
                          <Box className="barber-view">
                            <RemoveRedEyeIcon
                              style={{
                                color: "#004034",
                                fontSize: "20px",
                              }}
                            />
                            <span>{barber.memberViews}</span>
                          </Box>
                        </Stack>
                      </Stack>
                    );
                  })}
                </>
              )}
            </Stack>
            <Stack className={"pagination"}>
              <Stack className="pagination-box">
                {barber.length !== 0 &&
                  Math.ceil(total / searchFilter.limit) > 1 && (
                    <Stack className="pagination-box">
                      <Pagination
                        page={searchFilter.page ?? 1}
                        count={Math.ceil(total / searchFilter.limit)}
                        onChange={paginationChangeHandler}
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
                    </Stack>
                  )}
              </Stack>
              {barber.length !== 0 && (
                <span>
                  {t("Total")} {total} {total > 1 ? t("barbers") : t("barber")} {t("available")}
                </span>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default withLayoutBasic(Barber);
