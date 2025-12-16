import React, { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import { getJwtToken, logOut, updateUserInfo } from "../auth";
import { REACT_APP_API_URL } from "../config";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { CaretDown } from "phosphor-react";
import { alpha, styled } from "@mui/material/styles";
import Link from "next/link";
import { GET_MEMBER_ALL_NOTIFICATIONS } from "../../apollo/user/query";
import { NotificationStatus } from "../enums/notification.enum";

const Top = () => {
  const { t, i18n } = useTranslation("common");
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [lang, setLang] = useState<string | null>("en");
  const drop = Boolean(anchorEl2);
  const router = useRouter();
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const logoutOpen = Boolean(logoutAnchor);
  const [colorChange, setColorChange] = useState(false);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const { data: notificationsData } = useQuery(GET_MEMBER_ALL_NOTIFICATIONS, {
    variables: { input: { page: 1, limit: 50 } },
    fetchPolicy: "cache-and-network",
    skip: !user?._id,
  });
  const unread =
    notificationsData?.getMemberAllNotifications?.list?.filter(
      (n: any) => n.notificationStatus === NotificationStatus.UNREAD
    ).length || 0;

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("locale") === null) {
      localStorage.setItem("locale", "en");
      setLang("en");
    } else {
      setLang(localStorage.getItem("locale"));
    }
  }, [router]);

  /** HANDLERS **/
  const langClick = (e: any) => {
    setAnchorEl2(e.currentTarget);
  };

  const langClose = () => {
    setAnchorEl2(null);
  };

  const langChoice = useCallback(
    async (e: any) => {
      setLang(e.target.id);
      localStorage.setItem("locale", e.target.id);
      setAnchorEl2(null);
      await router.push(router.asPath, router.asPath, { locale: e.target.id });
    },
    [router]
  );

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      top: "109px",
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 160,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const changeNavbarColor = () => {
    if (window.scrollY >= 50) {
      setColorChange(true);
    } else {
      setColorChange(false);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", changeNavbarColor);
  }

  if (device === "mobile") {
    return (
      <Stack className="navbar">
        <Link href="/">
          <div className="chosen-link-basic">Home</div>
        </Link>
        <Link href="/service">
          <div className="chosen-link-basic">Service</div>
        </Link>
        <Link href="/barber">
          <div className="chosen-link-basic">Barbers</div>
        </Link>
        <Link href="/appointment">
          <div className="chosen-link-basic">Appointment</div>
        </Link>
        <Link href="/community">
          <div className="chosen-link-basic">Community</div>
        </Link>
        {false && (
          <Link href={"/mypage"}>
            <div className="chosen-link-basic">My Page</div>
          </Link>
        )}
        <Link href="/faq">
          <div className="chosen-link-basic">FAQ</div>
        </Link>
      </Stack>
    );
  } else {
    return (
      <Stack
        className={`navbar-basic ${colorChange ? "transparent" : ""} ${
          bgColor ? "transparent" : ""
        }`}
      >
        <Stack className="container">
          <Box className="logo-box-basic">
            <Link href="/">
              <img src="/logo/Logo2.png" alt="" />
            </Link>
            <Link href="/">
              <h1>Cropper</h1>
            </Link>
          </Box>
          <Box className="router-box-basic">
            <Link href="/">
              <div className="chosen-link-basic">{t("Home")}</div>
            </Link>
            <Link href="/service">
              <div className="chosen-link-basic">{t("Service")}</div>
            </Link>
            <Link href="/barber">
              <div className="chosen-link-basic">{t("Barbers")}</div>
            </Link>
            <Link href="/appointment">
              <div className="chosen-link-basic">{t("Appointment")}</div>
            </Link>
            <Link href="/community">
              <div className="chosen-link-basic">{t("Community")}</div>
            </Link>
            {user?._id && (
              <Link href={"/mypage"}>
                <div className="chosen-link-basic">{t("My Page")}</div>
              </Link>
            )}
            <Link href="/faq">
              <div className="chosen-link-basic">{t("FAQ")}</div>
            </Link>
          </Box>
          <Box className="user-box-basic">
            {user?._id ? (
              <>
                <div
                  className={"login-user-basic"}
                  onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
                >
                  <img
                    src={
                      user?.memberImage
                        ? `${REACT_APP_API_URL}/${user?.memberImage}`
                        : "/logo/defaultUser.svg"
                    }
                    alt=""
                  />
                </div>

                <Menu
                  id="basic-menu"
                  anchorEl={logoutAnchor}
                  open={logoutOpen}
                  onClose={() => {
                    setLogoutAnchor(null);
                  }}
                  sx={{ mt: "5px" }}
                >
                  <MenuItem onClick={() => logOut()}>
                    <Logout
                      fontSize="small"
                      style={{ color: "blue", marginRight: "10px" }}
                    />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link href={"/account"}>
                <div className={"join-box-basic"}>
                  <AccountCircleOutlinedIcon style={{ color: "#c6d984" }} />
                  <span>
                    {t("Login")} / {t("Register")}
                  </span>
                </div>
              </Link>
            )}

            <div className={"lan-box"}>
              {user?._id && (
                <Link href="/notification">
                  {unread > 0 ? (
                    <Badge
                      badgeContent={unread}
                      sx={{ color: "#c6d984 !important" }}
                    >
                      <NotificationsOutlinedIcon
                        className={"notification-icon"}
                      />
                    </Badge>
                  ) : (
                    <NotificationsOutlinedIcon
                      className={"notification-icon"}
                    />
                  )}
                </Link>
              )}
              <Button
                disableRipple
                className="btn-lang"
                onClick={langClick}
                endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
              >
                <Box component={"div"} className={"flag"}>
                  {lang !== null ? (
                    <img src={`/img/flag/lang${lang}.png`} alt={"usaFlag"} />
                  ) : (
                    <img src={`/img/flag/langen.png`} alt={"usaFlag"} />
                  )}
                </Box>
              </Button>

              <StyledMenu
                anchorEl={anchorEl2}
                open={drop}
                onClose={langClose}
                sx={{ position: "absolute" }}
              >
                <MenuItem disableRipple onClick={langChoice} id="en">
                  <img
                    className="img-flag"
                    src={"/img/flag/langen.png"}
                    onClick={langChoice}
                    id="en"
                    alt={"usaFlag"}
                  />
                  {t("English")}
                </MenuItem>
                <MenuItem disableRipple onClick={langChoice} id="kr">
                  <img
                    className="img-flag"
                    src={"/img/flag/langkr.png"}
                    onClick={langChoice}
                    id="kr"
                    alt={"koreanFlag"}
                  />
                  {t("Korean")}
                </MenuItem>
                <MenuItem disableRipple onClick={langChoice} id="cn">
                  <img
                    className="img-flag"
                    src={"/img/flag/langcn.png"}
                    onClick={langChoice}
                    id="cn"
                    alt={"chinaFlag"}
                  />
                  {t("Chinese")}
                </MenuItem>
                <MenuItem disableRipple onClick={langChoice} id="ru">
                  <img
                    className="img-flag"
                    src={"/img/flag/langru.png"}
                    onClick={langChoice}
                    id="ru"
                    alt={"russiaFlag"}
                  />
                  {t("Russian")}
                </MenuItem>
              </StyledMenu>
            </div>
          </Box>
        </Stack>
      </Stack>
    );
  }
};

export default Top;
