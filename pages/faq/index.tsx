import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import Faquestions from "../../libs/components/cs/Faquestions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const FAQ: NextPage = () => {
  const device = useDeviceDetect();
  const router = useRouter();

  /** HANDLERS **/

  if (device === "mobile") {
    return <h1>CS PAGE MOBILE</h1>;
  } else {
    return (
      <Stack className={"cs-page"}>
        <Typography className="hero-title">Cs Center</Typography>
        <Stack className={"container"}>
          <Box component={"div"} className={"cs-main-info"}>
            <Box component={"div"} className={"info"}>
              <span>Frequently asked quiestions</span>
            </Box>
          </Box>

          <Box component={"div"} className={"cs-content"}>
            <Faquestions />
          </Box>
        </Stack>
      </Stack>
    );
  }
};

export default withLayoutBasic(FAQ);
