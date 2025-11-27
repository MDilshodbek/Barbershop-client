import { Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import Mission from "../libs/components/homepage/Mission";
import Barbers from "../libs/components/homepage/TopBarber";
import Journal from "../libs/components/homepage/Journal";
import { Reviews } from "../libs/components/homepage/Review";

const Home: NextPage = () => {
  return (
    <Stack className="home-page">
      <Mission />
      <Barbers />
      <Reviews />
      <Journal />
    </Stack>
  );
};

export default withLayoutMain(Home);
