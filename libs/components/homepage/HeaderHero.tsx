import { Box, Stack } from "@mui/material";

const HeaderHero = () => {
  return (
    <>
      <Stack className="container">
        <Stack className="hero-top">
          <Box className="hero-slogan">
            <h1>Curating Signature Aesthetics for Modern Gentlemen</h1>
          </Box>
          <Stack className="hero-action">
            <Box className="hero-butt">
              <p>Book an appointment</p>
            </Box>
          </Stack>
        </Stack>
        <Stack className="hero-bottom">
          <img src="/img/bg16.png" alt="" />
        </Stack>
      </Stack>
    </>
  );
};

export default HeaderHero;
