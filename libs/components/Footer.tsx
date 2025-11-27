import { Box, Button, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from "@mui/icons-material/X";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const Footer = () => {
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
        <Stack className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>Service</p>
        </Stack>
        <Stack className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>Appointment</p>
        </Stack>
        <Stack className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>Community</p>
        </Stack>
        <Stack className="footer-link">
          <ArrowRightIcon style={{ color: "#c6d984" }} />
          <p>FAQ</p>
        </Stack>
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
