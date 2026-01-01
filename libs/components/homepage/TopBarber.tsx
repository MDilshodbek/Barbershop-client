import { Box, Stack } from "@mui/material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { GET_BARBERS } from "../../../apollo/user/query";
import { useState } from "react";
import { BarbersInquiry } from "../../types/member/member.input";
import { Member } from "../../types/member/member";
import { T } from "../../types/common";
import Link from "next/link";
import { LIKE_TARGET_MEMBER } from "../../../apollo/user/mutation";
import { Message } from "../../enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";
import { userVar } from "../../../apollo/store";
import useDeviceDetect from "../../hooks/useDeviceDetect";

interface TopBarbersProps {
  initialInput: BarbersInquiry;
}

const Barbers = (props: TopBarbersProps) => {
  const [topBarber, setTopBarber] = useState<Member[]>([]);
  const { initialInput } = props;
  const user = useReactiveVar(userVar);
  const device = useDeviceDetect();

  const {
    loading: getBarbersLoading,
    data: getBarbersData,
    error: getBarbersError,
    refetch: getBarbersRefetch,
  } = useQuery(GET_BARBERS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTopBarber(data?.getBarbers?.list);
    },
  });

  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  const likeMemberHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      // execute likeTargetProperty Mutation
      await likeTargetMember({ variables: { input: id } });

      // execute getPropertiesRefetch
      await getBarbersRefetch({ input: initialInput });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      sweetMixinErrorAlert(error.message).then();
    }
  };

  if (device === "mobile") {
    return (
      <Stack className="top-barbers top-barbers-mobile">
        <Stack className="container">
          <Stack className="top-barber-title">Cropper Masters</Stack>
          <Stack className="main-barbers">
            {topBarber.length === 0 ? (
              <Box component={"div"} className="empty-list">
                Top Barbers are not available
              </Box>
            ) : (
              <>
                {topBarber.map((barber: Member) => {
                  return (
                    <Stack key={barber._id} className="barber-card">
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
                      <Stack className="barber-stats">
                        <Box
                          className="stat-chip like"
                          onClick={() => likeMemberHandler(user, barber?._id)}
                        >
                          {barber?.meLiked && barber?.meLiked[0]?.myFavorite ? (
                            <FavoriteIcon style={{ color: "red" }} />
                          ) : (
                            <FavoriteBorderIcon style={{ color: "#004034" }} />
                          )}
                          <span>{barber.memberLikes}</span>
                        </Box>
                        <Box className="stat-chip views">
                          <RemoveRedEyeIcon
                            style={{
                              color: "#004034",
                              fontSize: "18px",
                            }}
                          />
                          <span>{barber.memberViews}</span>
                        </Box>
                      </Stack>
                      <Stack className="barber-socialmedia">
                        <FacebookOutlinedIcon
                          style={{
                            color: "#004034",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                        />
                        <InstagramIcon
                          style={{
                            color: "#004034",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                        />
                        <XIcon
                          style={{
                            color: "#004034",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                        />
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
  } else {
    return (
      <Stack className="top-barbers">
        <Stack className="container">
          <Stack className="top-barber-title">
            Step Inside the Cropper
            <br />
            Masters
          </Stack>
          <Stack className="main-barbers">
            {topBarber.length === 0 ? (
              <Box component={"div"} className="empty-list">
                Top Barbers are not available
              </Box>
            ) : (
              <>
                {topBarber.map((barber: Member) => {
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
                          {barber?.meLiked && barber?.meLiked[0]?.myFavorite ? (
                            <FavoriteIcon style={{ color: "red" }} />
                          ) : (
                            <FavoriteBorderIcon style={{ color: "#004034" }} />
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
        </Stack>
      </Stack>
    );
  }
};

Barbers.defaultProps = {
  initialInput: {
    page: 1,
    limit: 3,
    sort: "memberRank",
    direction: "DESC",
    search: {},
  },
};

export default Barbers;
