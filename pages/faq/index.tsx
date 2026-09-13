import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import Faquestions from "../../libs/components/cs/Faquestions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const FAQ: NextPage = () => {
  const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');


  /** HANDLERS **/

  if (device === "mobile") {
    return (
      <Stack className={"cs-page-mobile"}>
        <Typography className="hero-title">{t("Cs Center")}</Typography>
        <Stack className={"container"}>
          <Box component={"div"} className={"cs-main-info"}>
            <span>{t("Frequently Asked Questions")}</span>
          </Box>
          <Box component={"div"} className={"cs-content"}>
            <Faquestions />
          </Box>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={"cs-page"}>
        <Typography className="hero-title">{t("Cs Center")}</Typography>
        <Stack className={"container"}>
          <Box component={"div"} className={"cs-main-info"}>
            <Box component={"div"} className={"info"}>
              <span>{t("Frequently Asked Questions")}</span>
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
