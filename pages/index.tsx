import { Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import Mission from "../libs/components/homepage/Mission";
import Barbers from "../libs/components/homepage/TopBarber";
import Journal from "../libs/components/homepage/Journal";
import { UserReviews } from "../libs/components/homepage/Review";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";


const Home: NextPage = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return <Stack>HomePage Mobile</Stack>;
  } else {
    return (
      <Stack className="home-page">
        <Mission />
        <Barbers />
        <UserReviews />
        <Journal />
      </Stack>
    );
  }
};

export default withLayoutMain(Home);
