import { Box, Stack } from "@mui/material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useQuery } from "@apollo/client";
import { GET_BARBERS } from "../../../apollo/user/query";
import { useState } from "react";
import { BarbersInquiry } from "../../types/member/member.input";
import { Member } from "../../types/member/member";
import { T } from "../../types/common";
import Link from "next/link";

interface TopBarbersProps {
  initialInput: BarbersInquiry;
}

const Barbers = (props: TopBarbersProps) => {
  const [topBarber, setTopBarber] = useState<Member[]>([]);
  const { initialInput } = props;

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
                      <Box className="barber-like">
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
