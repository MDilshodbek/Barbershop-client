import { Stack } from "@mui/material";
import Head from "next/head";
import TopBasic from "../TopBasic";
import Footer from "../Footer";
import { useRouter } from "next/router";
import { useMemo } from "react";

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const router = useRouter();

    const memoizedValues = useMemo(() => {
      let title = "",
        desc = "",
        bgImage = "";

      switch (router.pathname) {
        case "/service":
          title = "Services";
          desc = "We are glad to see you again!";
          bgImage = "/banner/b1.svg";
          break;
        case "/appointment":
          title = "Appointment";
          desc = "Home / Appointment";
          bgImage = "/banner/b5.svg";
          break;
        case "/mypage":
          title = "My page";
          bgImage = "/banner/b4.svg";
          break;
        case "/community":
          title = "Community";
          desc = "Wellcome to our community";
          bgImage = "/banner/b6.svg";
          break;
        case "/community/detail":
          title = "Community Detail";
          desc = "Wellcome to our community";
          bgImage = "/banner/b7.svg";
          break;
        case "/faq":
          title = "FAQ";
          desc = "Frequently asked questions";
          bgImage = "/banner/b3.svg";
          break;
        case "/barber":
          title = "Barber Page";
          desc = "Our Barbers";
          bgImage = "/banner/b4.svg";
          break;
        case "/barber/detail":
          title = "Barber Detail Page";
          desc = "Our Barbers Info";
          bgImage = "/banner/b4.svg";
          break;
        default:
          break;
      }

      return { title, desc, bgImage };
    }, [router.pathname]);

    return (
      <>
        <Head>
          <title>Cropper</title>
          <meta name={"title"} content={`Cropper`} />
        </Head>
        <Stack id="pc-wrap">
          <Stack id={"top-basic"}>
            <TopBasic />
          </Stack>
          <Stack
            className={`header-basic`}
            style={{
              backgroundImage: `url(${memoizedValues.bgImage})`,
              backgroundSize: "cover",
              boxShadow: "inset 10px 40px 150px 40px rgb(24 22 36)",
            }}
          ></Stack>
          <Stack id={"main"}>
            <Component {...props} />
          </Stack>
          <Stack id={"footer"}>
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutBasic;
