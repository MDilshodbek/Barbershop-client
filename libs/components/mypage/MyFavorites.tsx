import React, { useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import { Member } from "../../types/member/member";
import { T } from "../../types/common";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { LIKE_TARGET_MEMBER } from "../../../apollo/user/mutation";
import { GET_FAVORITE_MEMBERS } from "../../../apollo/user/query";
import { Messages, REACT_APP_API_URL } from "../../config";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import Link from "next/link";
import { userVar } from "../../../apollo/store";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const MyFavorites: NextPage = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const [favoriteMembers, setFavoriteMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFavorites, setSearchFavorites] = useState<T>({
    page: 1,
    limit: 4,
  });

  /** APOLLO REQUESTS **/
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  const {
    loading: getFavoritesLoading,
    data: getFavoritesData,
    error: getFavoritesError,
    refetch: getFavoritesRefetch,
  } = useQuery(GET_FAVORITE_MEMBERS, {
    fetchPolicy: "network-only",
    variables: { input: searchFavorites },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setFavoriteMembers(data?.getFavoriteMembers?.list || []);
      setTotal(
        data?.getFavoriteMembers?.metaCounter?.[0]?.total ||
          data?.getFavoriteMembers?.metaCounter?.total ||
          0
      );
    },
  });

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFavorites({ ...searchFavorites, page: value });
  };

  const likeMemberHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);

      await likeTargetMember({ variables: { input: id } });
      await getFavoritesRefetch({ input: searchFavorites });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("Error, likeMemberHandler:", error.message);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  if (device === "mobile") {
    return <div>Cropper MY FAVORITES MOBILE</div>;
  } else {
    return (
      <div id="my-favorites-page">
        <Stack className="favorites-list-box barber-box">
          {favoriteMembers?.length ? (
            favoriteMembers.map((barber: Member) => {
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
                            ? `${REACT_APP_API_URL}/${barber?.memberImage}`
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
                      <FavoriteIcon style={{ color: "red" }} />
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
            })
          ) : (
            <div className={"no-data"}>
              <InfoOutlinedIcon className="info-icon" />
              <p>No Favorites found!</p>
            </div>
          )}
        </Stack>

        {favoriteMembers?.length ? (
          <Stack className="pagination-config">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(total / searchFavorites.limit)}
                page={searchFavorites.page}
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
              <Typography className="page-text">
                Total {total} favorite barber{total > 1 ? "s" : ""}
              </Typography>
            </Stack>
          </Stack>
        ) : null}
      </div>
    );
  }
};

export default MyFavorites;
