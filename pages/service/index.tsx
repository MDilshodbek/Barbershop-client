import { Container, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";

const Service: NextPage = () => {
  return (
    <Stack className="service-page">
      <Typography className="hero-title">Services</Typography>
      <Stack className="container">
        <Stack className="service-main">
          <Stack className="service-main-title">Our Signature Services</Stack>
          <Stack className="service-card">
            <Stack className="service-text-box">
              <Typography className="service-title">
                Haircut & Styling
              </Typography>
              <Typography className="service-desc">
                A meticulously executed haircut
              </Typography>
              <Typography className="service-time">60 min</Typography>
            </Stack>
            <Stack className="service-price">$25</Stack>
            <Stack className="service-images">
              <img src="/img/cut.jpg" alt="" />
              <img src="/img/cut2.jpg" alt="" />
              <img src="/img/cut4.jpg" alt="" />
            </Stack>
          </Stack>
          <Stack className="service-card">
            <Stack className="service-text-box">
              <Typography className="service-title">
                Beard Trimming & Styling
              </Typography>
              <Typography className="service-desc">
                A precisely shaped beard with clean, defined lines
              </Typography>
              <Typography className="service-time">30 min</Typography>
            </Stack>
            <Stack className="service-price">$20</Stack>
            <Stack className="service-images">
              <img src="/img/bbeard1.png" alt="" />
              <img src="/img/bbeard2.png" alt="" />
              <img src="/img/bbeard3.png" alt="" />
            </Stack>
          </Stack>
          <Stack className="service-card">
            <Stack className="service-text-box">
              <Typography className="service-title">
                Creative Haircut & Styling
              </Typography>
              <Typography className="service-desc">
                A freshly crafted, trend-forward style
              </Typography>
              <Typography className="service-time">60 min</Typography>
            </Stack>
            <Stack className="service-price">$30</Stack>
            <Stack className="service-images">
              <img src="/img/modeling.jpg" alt="" />
              <img src="/img/modeling2.jpg" alt="" />
              <img src="/img/modeling3.jpg" alt="" />
            </Stack>
          </Stack>
          <Stack className="service-card">
            <Stack className="service-text-box">
              <Typography className="service-title">
                Long Hair Cut & Styling
              </Typography>
              <Typography className="service-desc">
                A shape-enhancing cut with a styled, flowing finish
              </Typography>
              <Typography className="service-time">60 min</Typography>
            </Stack>
            <Stack className="service-price">$30</Stack>
            <Stack className="service-images">
              <img src="/img/gallery5.jpg" alt="" />
              <img src="/img/long-hair2.jpg" alt="" />
              <img src="/img/long-hair4.jpg" alt="" />
            </Stack>
          </Stack>
          <Stack className="service-card">
            <Stack className="service-text-box">
              <Typography className="service-title">Perm & Styling</Typography>
              <Typography className="service-desc">
                A textured transformation with a defined, styled finish
              </Typography>
              <Typography className="service-time">1H 20MIN</Typography>
            </Stack>
            <Stack className="service-price">$40</Stack>
            <Stack className="service-images">
              <img src="/img/perm.jpeg" alt="" />
              <img src="/img/perm4.jpg" alt="" />
              <img src="/img/perm5.jpg" alt="" />
            </Stack>
          </Stack>
          <Stack className="service-card">
            <Stack className="service-text-box">
              <Typography className="service-title">Paint & Styling</Typography>
              <Typography className="service-desc">
                A vibrant color update with a smooth, styled finish
              </Typography>
              <Typography className="service-time">1H 30min</Typography>
            </Stack>
            <Stack className="service-price">$40</Stack>
            <Stack className="service-images">
              <img src="/img/paint1.png" alt="" />
              <img src="/img/paint2.png" alt="" />
              <img src="/img/painting3.jpg" alt="" />
            </Stack>
          </Stack>
          <Stack className="service-card">
            <Stack className="service-text-box">
              <Typography className="service-title">
                Children’s Haircut (up to 10)
              </Typography>
              <Typography className="service-desc">
                A neat, gentle cut designed for comfort and style
              </Typography>
              <Typography className="service-time">60 min</Typography>
            </Stack>
            <Stack className="service-price">$25</Stack>
            <Stack className="service-images">
              <img src="/img/babycut.jpg" alt="" />
              <img src="/img/babycut4.jpg" alt="" />
              <img src="/img/babycut5.jpg" alt="" />
            </Stack>
          </Stack>
          <Stack className="service-card">
            <Stack className="service-text-box">
              <Typography className="service-title">
                Hair Wash & Style
              </Typography>
              <Typography className="service-desc">
                A clean refresh with a sleek, styled finish
              </Typography>
              <Typography className="service-time">20 min</Typography>
            </Stack>
            <Stack className="service-price">$10</Stack>
            <Stack className="service-images">
              <img src="/img/wash.webp" alt="" />
              <img src="/img/dry3.png" alt="" />
              <img src="/img/dry2.png" alt="" />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Service);
