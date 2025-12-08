import React, { useCallback, useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Popover,
} from "@mui/material";
import { useRouter } from "next/router";
import { logIn, signUp } from "../../libs/auth";
import { sweetMixinErrorAlert } from "../../libs/sweetAlert";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// export const getStaticProps = async ({ locale }: any) => ({
// 	props: {
// 		...(await serverSideTranslations(locale, ['common'])),
// 	},
// });

const Join: NextPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const [rightActive, setRightActive] = useState(false);
  const [input, setInput] = useState({
    nick: "",
    password: "",
    phone: "",
    type: "USER",
  });

  /** HANDLERS **/

  const checkUserTypeHandler = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      const value = e.target.name;
      handleInput("type", value);
    } else {
      handleInput("type", "USER");
    }
  };

  const handleInput = useCallback((name: any, value: any) => {
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);

  const doLogin = useCallback(async () => {
    console.warn(input);
    try {
      await logIn(input.nick, input.password);
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input]);

  const doSignUp = useCallback(async () => {
    console.warn(input);
    try {
      await signUp(input.nick, input.password, input.phone, input.type);
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input]);

  console.log("+input: ", input);

  if (device === "mobile") {
    return <div>LOGIN MOBILE</div>;
  } else {
    return (
      <Stack className="join-page">
        <Typography className="join-title">Welcome</Typography>
        <Stack className="container">
          <Box
            className={`auth-container ${
              rightActive ? "right-panel-active" : ""
            }`}
          >
            {/* SIGN UP PANEL */}
            <Stack className="form-container sign-up-container">
              <form>
                <Typography className="title">Create Account</Typography>

                <TextField
                  fullWidth
                  variant="filled"
                  label="Nickname"
                  onChange={(e) => handleInput("nick", e.target.value)}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Phone number"
                  onChange={(e) => handleInput("phone", e.target.value)}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Password"
                  type="password"
                  onChange={(e) => handleInput("password", e.target.value)}
                />

                <Box className="register">
                  <div className="type-option">
                    <span className="text">I want to be registered as:</span>

                    <div className="checkbox-column">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              name="USER"
                              onChange={checkUserTypeHandler}
                              checked={input.type === "USER"}
                            />
                          }
                          label="User"
                        />
                      </FormGroup>

                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              name="BARBER"
                              onChange={checkUserTypeHandler}
                              checked={input.type === "BARBER"}
                            />
                          }
                          label="Barber"
                        />
                      </FormGroup>
                    </div>
                  </div>

                  <Typography className="subtitle">register with</Typography>

                  <Stack className="social-container">
                    <IconButton className="social">
                      <FacebookIcon />
                    </IconButton>
                    <IconButton className="social">
                      <GoogleIcon />
                    </IconButton>
                    <IconButton className="social">
                      <LinkedInIcon />
                    </IconButton>
                  </Stack>

                  <Button
                    variant="contained"
                    className="main-btn"
                    disabled={
                      input.nick === "" ||
                      input.password === "" ||
                      input.phone === "" ||
                      input.type === ""
                    }
                    onClick={doSignUp}
                  >
                    SIGNUP
                  </Button>
                </Box>
              </form>
            </Stack>

            {/* LOG IN PANEL */}
            <Stack className="form-container sign-in-container">
              <form>
                <Typography className="title">Login</Typography>

                <TextField
                  fullWidth
                  variant="filled"
                  label="Nickname"
                  onChange={(e) => handleInput("nick", e.target.value)}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Password"
                  type="password"
                  onChange={(e) => handleInput("password", e.target.value)}
                />

                <Typography className="subtitle">login with</Typography>

                <Stack direction="row" spacing={1} className="social-container">
                  <IconButton className="social">
                    <FacebookIcon />
                  </IconButton>
                  <IconButton className="social">
                    <GoogleIcon />
                  </IconButton>
                  <IconButton className="social">
                    <LinkedInIcon />
                  </IconButton>
                </Stack>

                <Button
                  variant="contained"
                  className="main-btn"
                  disabled={input.nick === "" || input.password === ""}
                  onClick={doLogin}
                >
                  LOGIN
                </Button>
              </form>
            </Stack>

            {/* OVERLAY PANELS (same as before) */}
            <Box className="overlay-container">
              <Box className="overlay">
                <Box className="overlay-panel overlay-left">
                  <Stack className="overlay-main-left">
                    <Stack className="brand-logo-box">
                      <img
                        className="brand-logo"
                        src="/logo/Logo2.png"
                        alt=""
                      />
                      <span className="brand-name">Cropper</span>
                    </Stack>
                    <Typography variant="h4">Welcome Back!</Typography>
                    <Typography>
                      To keep connected with us <br /> please login with your personal
                      info
                    </Typography>
                    <Button
                      className="ghost-btn"
                      onClick={() => setRightActive(false)}
                    >
                      LogIn
                    </Button>
                  </Stack>
                </Box>

                <Box className="overlay-panel overlay-right">
                  <Stack className="overlay-main">
                    <Stack className="brand-logo-box">
                      <img  src="/logo/Logo2.png" alt="" />
                      <span className="brand-name">Cropper</span>
                    </Stack>
                    <Typography variant="h4">Hello, Gentleman!</Typography>
                    <Typography>
                      Enter your personal details and start your <br /> journey with us.
                    </Typography>
                    <Button
                      className="ghost-btn"
                      onClick={() => setRightActive(true)}
                    >
                      Sign Up
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Stack>
    );
  }
};

export default withLayoutBasic(Join);
