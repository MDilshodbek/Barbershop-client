import React, { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import { REACT_APP_API_URL } from "../config";
import { getJwtToken, logOut, updateUserInfo } from "../auth";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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
      const nextLocale = e.currentTarget.id;
      setLang(nextLocale);
      localStorage.setItem("locale", nextLocale);
      setAnchorEl2(null);
      await router.push(router.asPath, router.asPath, { locale: nextLocale });
    },
    [router]
  );

  const mobileLangChoice = useCallback(
    async (e: any) => {
      await langChoice(e);
      setMobileMenuOpen(false);
    },
    [langChoice]
  );

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const mobileLogoutHandler = () => {
    setMobileMenuOpen(false);
    logOut();
  };

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
    const mobileNavLinks = [
      { href: "/", label: t("Home") },
      { href: "/service", label: t("Service") },
      { href: "/barber", label: t("Barbers") },
      { href: "/appointment", label: t("Appointment") },
      { href: "/community", label: t("Community") },
      ...(user?._id ? [{ href: "/mypage", label: t("My Page") }] : []),
      { href: "/faq", label: t("FAQ") },
    ];

    const languageOptions = [
      { id: "en", label: t("English"), flag: "langen.png" },
      { id: "kr", label: t("Korean"), flag: "langkr.png" },
      { id: "cn", label: t("Chinese"), flag: "langcn.png" },
      { id: "ru", label: t("Russian"), flag: "langru.png" },
    ];

    return (
      <>
        <Stack className="mobile-nav" direction="row">
          <Link href="/">
            <Box className="mobile-nav-brand">
              <img src="/logo/Logo.svg" alt="" />
              <span>Cropper</span>
            </Box>
          </Link>

          <Stack className="mobile-nav-actions" direction="row">
            {user?._id && (
              <Link href="/notification">
                <IconButton className="mobile-nav-icon-btn" disableRipple>
                  {unread > 0 ? (
                    <Badge
                      badgeContent={unread}
                      sx={{ color: "#ff0000ff !important" }}
                    >
                      <NotificationsOutlinedIcon
                        sx={{ color: "#004034 !important" }}
                      />
                    </Badge>
                  ) : (
                    <NotificationsOutlinedIcon
                      sx={{ color: "#004034 !important" }}
                    />
                  )}
                </IconButton>
              </Link>
            )}
            <IconButton
              className="mobile-nav-menu-btn"
              disableRipple
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuRoundedIcon sx={{ color: "#004034" }} />
            </IconButton>
          </Stack>
        </Stack>

        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={closeMobileMenu}
          className="mobile-nav-drawer"
        >
          <Stack className="mobile-drawer-content">
            <Stack
              className="mobile-drawer-head"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box className="mobile-nav-brand">
                <img src="/logo/Logo.svg" alt="" />
                <span>Cropper</span>
              </Box>
              <IconButton disableRipple onClick={closeMobileMenu}>
                <CloseRoundedIcon sx={{ color: "#004034" }} />
              </IconButton>
            </Stack>

            {user?._id && (
              <Link href="/mypage" onClick={closeMobileMenu}>
                <Stack
                  className="mobile-drawer-user"
                  direction="row"
                  alignItems="center"
                >
                  <img
                    className="mobile-drawer-avatar"
                    src={
                      user?.memberImage
                        ? `${REACT_APP_API_URL}/${user?.memberImage}`
                        : "/logo/User-avatar.png"
                    }
                    alt=""
                  />
                  <span>{user?.memberNick}</span>
                </Stack>
              </Link>
            )}

            <Stack className="mobile-drawer-links">
              {mobileNavLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  onClick={closeMobileMenu}
                >
                  <div
                    className={`mobile-drawer-link ${
                      router.pathname === link.href ? "active" : ""
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </Stack>

            <div className="mobile-drawer-divider" />

            {user?._id ? (
              <Button
                disableRipple
                className="mobile-drawer-logout"
                onClick={mobileLogoutHandler}
              >
                <Logout fontSize="small" />
                {t("Logout")}
              </Button>
            ) : (
              <Link href="/account" onClick={closeMobileMenu}>
                <div className="mobile-drawer-auth">
                  <AccountCircleOutlinedIcon />
                  <span>
                    {t("Login")} / {t("Register")}
                  </span>
                </div>
              </Link>
            )}

            <div className="mobile-drawer-divider" />

            <Stack className="mobile-drawer-lang">
              <span className="mobile-drawer-lang-label">
                {t("Language")}
              </span>
              <Stack className="mobile-drawer-lang-options" direction="row">
                {languageOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    id={option.id}
                    className={lang === option.id ? "active" : ""}
                    onClick={mobileLangChoice}
                  >
                    <img
                      src={`/img/flag/${option.flag}`}
                      id={option.id}
                      alt={option.label}
                    />
                    <span>{option.label}</span>
                  </button>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Drawer>
      </>
    );
  } else {
    return (
      <Stack
        className={`navbar ${colorChange ? "transparent" : ""} ${
          bgColor ? "transparent" : ""
        }`}
      >
        <Stack className="container">
          <Box className="logo-box">
            <Link href="/">
              <img src="/logo/Logo.svg" alt="" />
            </Link>
            <Link href="/">
              <h1>Cropper</h1>
            </Link>
          </Box>
          <Box className="router-box">
            <Link href="/">
              <div className="chosen-link">{t("Home")}</div>
            </Link>
            <Link href="/service">
              <div className="chosen-link">{t("Service")}</div>
            </Link>
            <Link href="/barber">
              <div className="chosen-link">{t("Barbers")}</div>
            </Link>
            <Link href="/appointment">
              <div className="chosen-link">{t("Appointment")}</div>
            </Link>
            <Link href="/community">
              <div className="chosen-link">{t("Community")}</div>
            </Link>
            {user?._id && (
              <Link href={"/mypage"}>
                <div className="chosen-link">{t("My Page")}</div>
              </Link>
            )}
            <Link href="/faq">
              <div className="chosen-link">{t("FAQ")}</div>
            </Link>
          </Box>
          <Box className="user-box">
            {user?._id ? (
              <>
                <div
                  className={"login-user"}
                  onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
                >
                  <img
                    src={
                      user?.memberImage
                        ? `${REACT_APP_API_URL}/${user?.memberImage}`
                        : "/logo/User-avatar.png"
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
                    {t("Logout")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link href={"/account"}>
                <div className={"join-box"}>
                  <AccountCircleOutlinedIcon style={{ color: "#004034" }} />
                  <span style={{ color: "#004034" }}>
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
                      sx={{ color: "#ff0000ff !important"}}
                    >
                      <NotificationsOutlinedIcon
                        className={"notification-icon"}
                        sx={{ color: "#004034 !important" }}
                      />
                    </Badge>
                  ) : (
                    <NotificationsOutlinedIcon
                      className={"notification-icon"}
                      sx={{ color: "#004034 !important" }}
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
