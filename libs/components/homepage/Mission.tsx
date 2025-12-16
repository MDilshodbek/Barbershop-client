import { Stack, Typography } from "@mui/material";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import useDeviceDetect from "../../hooks/useDeviceDetect";

const Mission = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return (
      <Stack className="cropper-mission mission-mobile">
        <Stack className="container">
          <Stack className="mission">
            <h1>Why Cropper?</h1>
            <Typography className="mission-desc">
              <FormatQuoteRoundedIcon
                style={{
                  color: "#004034",
                  fontSize: "48px",
                  marginRight: "8px",
                }}
              />
              Transformative grooming that unlocks personal style and confidence.
            </Typography>
          </Stack>
          <Stack className="mission-img">
            <img src="/img/stats.png" alt="" />
          </Stack>
          <Stack className="statistics statistics-mobile">
            <Stack className="stat-card">
              <h1 className="stat-number">11+</h1>
              <Typography className="stat-text">
                Years of Combined Barbering Expertise
              </Typography>
            </Stack>
            <Stack className="stat-card">
              <h1 className="stat-number">6+</h1>
              <Typography className="stat-text">
                Specialty Masters with unrivaled mastery
              </Typography>
            </Stack>
            <Stack className="stat-card">
              <h1 className="stat-number">4K</h1>
              <Typography className="stat-text">
                Signature Looks Crafted
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className="cropper-mission">
        <Stack className="container">
          <Stack className="mission">
            <h1>Why Cropper?</h1>
            <Typography className="mission-desc">
              <FormatQuoteRoundedIcon
                style={{
                  color: "#004034",
                  fontSize: "80px",
                }}
              />
              At Cropper, our mission is to curate transformative grooming
              experiences that unlock the ultimate expression of personal style
              and confidence for each client
            </Typography>
          </Stack>
          <Stack className="mission-img">
            <img src="/img/stats.png" alt="" />
          </Stack>
          <Stack className="statistics">
            <Stack>
              <h1 className="stat-number">11+</h1>
              <Typography className="stat-text">
                Years of Combined Barbering Expertise
              </Typography>
            </Stack>
            <Stack>
              <h1 className="stat-number">6+</h1>
              <Typography className="stat-text">
                Specialty Masters who have achieved unrivaled mastery{" "}
              </Typography>
            </Stack>
            <Stack>
              <h1 className="stat-number">4K</h1>
              <Typography className="stat-text">
                Signature Looks Crafted
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default Mission;
