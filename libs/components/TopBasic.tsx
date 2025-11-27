import React from "react";
import { Box, colors, Link, Menu, MenuItem, Stack } from "@mui/material";
import { Logout } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const Top = () => {
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const logoutOpen = Boolean(logoutAnchor);
  return (
    <Stack className="navbar-basic">
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
          {false && (
            <Link href={"/mypage"}>
              <div className="chosen-link-basic">My Page</div>
            </Link>
          )}
          <Link href="faq">
            <div className="chosen-link-basic">FAQ</div>
          </Link>
        </Box>
        <Box className="user-box-basic">
          {true ? (
            <>
              <div className="login-user-basic">
                <img src="/logo/defaultUser.svg" alt="" />
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
                <MenuItem>
                  <Logout />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link href={"/account/join"}>
              <div className={"join-box-basic"}>
                <AccountCircleOutlinedIcon style={{ color: "#C6D984" }} />
                <span style={{ color: "#C6D984" }}>Login / Register</span>
              </div>
            </Link>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Top;
