import { Box, Stack } from "@mui/material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Barbers = () => {
  return (
    <Stack className="top-barbers">
      <Stack className="container">
        <Stack className="top-barber-title">
          Step Inside the Cropper
          <br />
          Masters
        </Stack>
        <Stack className="main-barbers">
          <Stack className="barber-info">
            <Box className="barber-img">
              <img src="/img/barber1.png" alt="" />
            </Box>
            <Box className="barber-name">Dominick Rossi</Box>
            <Stack className="barber-media">
              <Box className="barber-like">
                <FavoriteBorderIcon
                  style={{
                    color: "#004034",
                    fontSize: "20px",
                  }}
                />
              </Box>
              <Stack className="barber-socialmedia">
                <FacebookOutlinedIcon
                  style={{ color: "#004034", fontSize: "20px" }}
                />
                <InstagramIcon style={{ color: "#004034", fontSize: "20px" }} />
                <XIcon style={{ color: "#004034", fontSize: "20px" }} />
              </Stack>
              <Box className="barber-view">
                <RemoveRedEyeIcon
                  style={{
                    color: "#004034",
                    fontSize: "20px",
                  }}
                />
              </Box>
            </Stack>
          </Stack>
          <Stack className="barber-info">
            <Box className="barber-img">
              <img src="/img/barber1.png" alt="" />
            </Box>
            <Box className="barber-name">Dominick Rossi</Box>
            <Stack className="barber-media">
              <Box className="barber-like">
                <FavoriteBorderIcon
                  style={{
                    color: "#004034",
                    fontSize: "20px",
                  }}
                />
              </Box>
              <Stack className="barber-socialmedia">
                <FacebookOutlinedIcon
                  style={{ color: "#004034", fontSize: "20px" }}
                />
                <InstagramIcon style={{ color: "#004034", fontSize: "20px" }} />
                <XIcon style={{ color: "#004034", fontSize: "20px" }} />
              </Stack>
              <Box className="barber-view">
                <RemoveRedEyeIcon
                  style={{
                    color: "#004034",
                    fontSize: "20px",
                  }}
                />
              </Box>
            </Stack>
          </Stack>
          <Stack className="barber-info">
            <Box className="barber-img">
              <img src="/img/barber1.png" alt="" />
            </Box>
            <Box className="barber-name">Dominick Rossi</Box>
            <Stack className="barber-media">
              <Box className="barber-like">
                <FavoriteBorderIcon
                  style={{
                    color: "#004034",
                    fontSize: "20px",
                  }}
                />
              </Box>
              <Stack className="barber-socialmedia">
                <FacebookOutlinedIcon
                  style={{ color: "#004034", fontSize: "20px" }}
                />
                <InstagramIcon style={{ color: "#004034", fontSize: "20px" }} />
                <XIcon style={{ color: "#004034", fontSize: "20px" }} />
              </Stack>
              <Box className="barber-view">
                <RemoveRedEyeIcon
                  style={{
                    color: "#004034",
                    fontSize: "20px",
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Barbers;
