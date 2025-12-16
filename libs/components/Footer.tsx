import { Box, Button, Link, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from "@mui/icons-material/X";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";

const Footer = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  if (device === "mobile") {
    return (
      <Stack className="footer-container footer-mobile">
        <Stack className="footer-top">
          <Stack className="signup">
            <h1>Stay up to deals</h1>
            <p>Fresh drops, deals, and updates—right to your inbox.</p>
          </Stack>
          <Stack className="email">
            <TextField
              id="standard-email-input"
              label="Email"
              type="email"
              variant="standard"
            />
            <Button variant="outlined" startIcon={<SendIcon />}>
              Send
            </Button>
          </Stack>
          <Stack className="social-media">
            <FacebookOutlinedIcon
              style={{ color: "white", fontSize: "26px" }}
            />
            <InstagramIcon style={{ color: "white", fontSize: "26px" }} />
            <YouTubeIcon style={{ color: "white", fontSize: "26px" }} />
            <XIcon style={{ color: "white", fontSize: "26px" }} />
          </Stack>
        </Stack>

        <Stack className="footer-nav">
          <Link href="service" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>Service</p>
          </Link>
          <Link href="barber" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>Barbers</p>
          </Link>
          <Link href="appointment" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>Appointment</p>
          </Link>
          <Link href="community" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>Community</p>
          </Link>
          {user?._id && (
            <Link href="/mypage" className="footer-link">
              <ArrowRightIcon style={{ color: "#c6d984" }} />
              <p>My Page</p>
            </Link>
          )}
          <Link href="faq" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>FAQ</p>
          </Link>
        </Stack>

        <Stack className="footer-bottom">
          <Stack className="schedule">
            <Box>Mon : CLOSED</Box>
            <Box>Tue : 9AM~7PM</Box>
            <Box>Wed : 9AM~7PM</Box>
            <Box>Thu : 9AM~7PM</Box>
            <Box>Fri : 9AM~7PM</Box>
            <Box>Sat : 9AM~7PM</Box>
            <Box>Sun : 9AM~7PM</Box>
          </Stack>
          <Box className="brand">Cropper © 2025</Box>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className="container">
        <Stack className="media">
          <Stack className="signup">
            <h1>Sign up For Exclusive Deals and Updates</h1>
          </Stack>
          <Stack className="email">
            <TextField
              id="standard-email-input"
              label="Email"
              type="email"
              variant="standard"
            />
            <Button variant="outlined" startIcon={<SendIcon />}>
              Send
            </Button>
          </Stack>
          <Stack className="social-media">
            <FacebookOutlinedIcon
              style={{ color: "white", fontSize: "30px" }}
            />
            <InstagramIcon style={{ color: "white", fontSize: "30px" }} />
            <YouTubeIcon style={{ color: "white", fontSize: "30px" }} />
            <XIcon style={{ color: "white", fontSize: "30px" }} />
          </Stack>
        </Stack>
        <Stack className="footer-router">
          <Link href="service" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>Service</p>
          </Link>
          <Link href="barber" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>Babers</p>
          </Link>
          <Link href="appointment" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>Appointment</p>
          </Link>
          <Link href="community" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>Community</p>
          </Link>
          {user?._id && (
            <Link href={"/mypage"} className="footer-link">
              <ArrowRightIcon style={{ color: "#c6d984" }} />
              <p>My Page</p>
            </Link>
          )}
          <Link href="faq" className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>FAQ</p>
          </Link>
        </Stack>
        <Stack className="schedule">
          <Box>Monday ----------------- CLOSED</Box>
          <Box>Tuesday --------------- 9AM - 7PM</Box>
          <Box>Wednesday ------------ 9AM - 7PM</Box>
          <Box>Thursday -------------- 9AM - 7PM</Box>
          <Box>Friday ----------------- 9AM - 7PM</Box>
          <Box>Saturday --------------- 9AM - 7PM</Box>
          <Box>Sunday ---------------- 9AM - 7PM</Box>
        </Stack>
      </Stack>
    );
  }
  return (
    <Stack className="container">
      <Stack className="media">
        <Stack className="signup">
          <h1>Sign up For Exclusive Deals and Updates</h1>
        </Stack>
        <Stack className="email">
          <TextField
            id="standard-email-input"
            label="Email"
            type="email"
            variant="standard"
          />
          <Button variant="outlined" startIcon={<SendIcon />}>
            Send
          </Button>
        </Stack>
        <Stack className="social-media">
          <FacebookOutlinedIcon style={{ color: "white", fontSize: "30px" }} />
          <InstagramIcon style={{ color: "white", fontSize: "30px" }} />
          <YouTubeIcon style={{ color: "white", fontSize: "30px" }} />
          <XIcon style={{ color: "white", fontSize: "30px" }} />
        </Stack>
      </Stack>
      <Stack className="footer-router">
        <Link href="service" className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>Service</p>
        </Link>
        <Link href="barber" className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>Babers</p>
        </Link>
        <Link href="appointment" className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>Appointment</p>
        </Link>
        <Link href="community" className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>Community</p>
        </Link>
        {false && (
          <Link href={"/mypage"} className="footer-link">
            <ArrowRightIcon style={{ color: "#c6d984" }} />
            <p>My Page</p>
          </Link>
        )}
        <Link href="faq" className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>FAQ</p>
        </Link>
      </Stack>
      <Stack className="schedule">
        <Box>Monday ----------------- CLOSED</Box>
        <Box>Tuesday --------------- 9AM - 7PM</Box>
        <Box>Wednesday ------------ 9AM - 7PM</Box>
        <Box>Thursday -------------- 9AM - 7PM</Box>
        <Box>Friday ----------------- 9AM - 7PM</Box>
        <Box>Saturday --------------- 9AM - 7PM</Box>
        <Box>Sunday ---------------- 9AM - 7PM</Box>
      </Stack>
    </Stack>
  );
};

export default Footer;
