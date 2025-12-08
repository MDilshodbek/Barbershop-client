import React, { useEffect, useState } from "react";
import { Box, Link, Menu, MenuItem, Stack } from "@mui/material";
import { Logout } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import { getJwtToken, logOut, updateUserInfo } from "../auth";
import { REACT_APP_API_URL } from "../config";

const Top = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const logoutOpen = Boolean(logoutAnchor);
  const [colorChange, setColorChange] = useState(false);
  const [bgColor, setBgColor] = useState<boolean>(false);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

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
        <Link href="service">
          <div className="chosen-link-basic">Service</div>
        </Link>
        <Link href="barber">
          <div className="chosen-link-basic">Barbers</div>
        </Link>
        <Link href="appointment">
          <div className="chosen-link-basic">Appointment</div>
        </Link>
        <Link href="community">
          <div className="chosen-link-basic">Community</div>
        </Link>
        {false && (
          <Link href={"/mypage"}>
            <div className="chosen-link-basic">My Page</div>
          </Link>
        )}
        <Link href="faq">
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
              <div className="chosen-link-basic">Home</div>
            </Link>
            <Link href="service">
              <div className="chosen-link-basic">Service</div>
            </Link>
            <Link href="barber">
              <div className="chosen-link-basic">Barbers</div>
            </Link>
            <Link href="appointment">
              <div className="chosen-link-basic">Appointment</div>
            </Link>
            <Link href="community">
              <div className="chosen-link-basic">Community</div>
            </Link>
            {user?._id && (
              <Link href={"/mypage"}>
                <div className="chosen-link-basic">My Page</div>
              </Link>
            )}
            <Link href="faq">
              <div className="chosen-link-basic">FAQ</div>
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
                  <span>Login / Register</span>
                </div>
              </Link>
            )}
          </Box>
        </Stack>
      </Stack>
    );
  }
};

export default Top;
