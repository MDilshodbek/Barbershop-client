import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Link from "next/link";

const HeaderHero = () => {
  const { t, i18n } = useTranslation("common");
  const device = useDeviceDetect();

  if (device === "mobile") {
    return (
      <Stack className="container hero-mobile">
        <Stack className="hero-top">
          <Box className="hero-slogan">
            <h1>{t("Signature looks")}</h1>
          </Box>
          <Link href="/appointment">
            <Box className="hero-butt hero-butt-mobile">
              <p>{t("Book an appointment")}</p>
            </Box>
          </Link>
        </Stack>
        <Stack className="hero-bottom">
          <img src="/img/bg16.png" alt="" />
        </Stack>
      </Stack>
    );
  } else {
    return (
      <>
        <Stack className="container">
          <Stack className="hero-top">
            <Box className="hero-slogan">
              <h1>{t("Curating Signature Aesthetics for Modern Gentlemen")}</h1>
            </Box>
            <Stack className="hero-action">
              <Link href="/appointment">
                <Box className="hero-butt">
                  <p>{t("Book an appointment")}</p>
                </Box>
              </Link>
            </Stack>
          </Stack>
          <Stack className="hero-bottom">
            <img src="/img/bg16.png" alt="" />
          </Stack>
        </Stack>
      </>
    );
  }
};

export default HeaderHero;
