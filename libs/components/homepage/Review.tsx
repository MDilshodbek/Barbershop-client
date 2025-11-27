import { Box, Rating, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { useMemo, useState } from "react";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export function Reviews() {
  const [value, setValue] = useState<number | null>(2);

  const slidesOffsetBefore = useMemo(() => {
    // COMMENT: during SSR, window is not defined, so return 0
    if (typeof window === "undefined") return 0;
    return window.innerWidth * 0.2;
  }, []);

  return (
    <div className={"review-frame"}>
      <Stack className={"container"}>
        <Stack className="review-box">
          <Typography component="span">
            <Box className="review-main-title">
              Authentic Testimonials
              <br /> From Our Clients
            </Box>
          </Typography>
          <Typography className="review-subtitle">
            Read feedbacks from those who have enjoyed and satisfied our
            services
          </Typography>
        </Stack>

        <Swiper
          className={"review-info swiper-wrapper"}
          centeredSlides={false}
          slidesPerView={"auto"}
          slidesOffsetBefore={slidesOffsetBefore}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide className={"review-info-frame"}>
            <Box className="mark">
              <FormatQuoteRoundedIcon
                style={{
                  color: "#004034",
                  fontSize: "40px",
                }}
              />
            </Box>
            <Box className="review-comment">
              {
                "The level of attention and artistry from the barbers at Cropper is truly unmatched. The barbers at Cropper really take the time to understand what style works for you. My cuts have never looked better"
              }
            </Box>
            <Stack className="review-user">
              <img className="review-userimg" src={"/img/barber3.png"} alt="" />
              <Stack className="review-user-info">
                <Box className="review-username">{"Oscar"}</Box>
                <Rating
                  className="review-starts"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Stack>
            </Stack>
          </SwiperSlide>
          <SwiperSlide className={"review-info-frame"}>
            <Box className="mark">
              <FormatQuoteRoundedIcon
                style={{
                  color: "#004034",
                  fontSize: "40px",
                }}
              />
            </Box>
            <Box className="review-comment">
              {
                "The level of attention and artistry from the barbers at Cropper is truly unmatched. The barbers at Cropper really take the time to understand what style works for you. My cuts have never looked better"
              }
            </Box>
            <Stack className="review-user">
              <img className="review-userimg" src={"/img/barber3.png"} alt="" />
              <Stack className="review-user-info">
                <Box className="review-username">{"Oscar"}</Box>
                <Rating
                  className="review-starts"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Stack>
            </Stack>
          </SwiperSlide>
          <SwiperSlide className={"review-info-frame"}>
            <Box className="mark">
              <FormatQuoteRoundedIcon
                style={{
                  color: "#004034",
                  fontSize: "40px",
                }}
              />
            </Box>
            <Box className="review-comment">
              {
                "The level of attention and artistry from the barbers at Cropper is truly unmatched. The barbers at Cropper really take the time to understand what style works for you. My cuts have never looked better"
              }
            </Box>
            <Stack className="review-user">
              <img className="review-userimg" src={"/img/barber3.png"} alt="" />
              <Stack className="review-user-info">
                <Box className="review-username">{"Oscar"}</Box>
                <Rating
                  className="review-starts"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Stack>
            </Stack>
          </SwiperSlide>
          <SwiperSlide className={"review-info-frame"}>
            <Box className="mark">
              <FormatQuoteRoundedIcon
                style={{
                  color: "#004034",
                  fontSize: "40px",
                }}
              />
            </Box>
            <Box className="review-comment">
              {
                "The level of attention and artistry from the barbers at Cropper is truly unmatched. The barbers at Cropper really take the time to understand what style works for you. My cuts have never looked better"
              }
            </Box>
            <Stack className="review-user">
              <img className="review-userimg" src={"/img/barber3.png"} alt="" />
              <Stack className="review-user-info">
                <Box className="review-username">{"Oscar"}</Box>
                <Rating
                  className="review-starts"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Stack>
            </Stack>
          </SwiperSlide>
          <SwiperSlide className={"review-info-frame"}>
            <Box className="mark">
              <FormatQuoteRoundedIcon
                style={{
                  color: "#004034",
                  fontSize: "40px",
                }}
              />
            </Box>
            <Box className="review-comment">
              {
                "The level of attention and artistry from the barbers at Cropper is truly unmatched. The barbers at Cropper really take the time to understand what style works for you. My cuts have never looked better"
              }
            </Box>
            <Stack className="review-user">
              <img className="review-userimg" src={"/img/barber3.png"} alt="" />
              <Stack className="review-user-info">
                <Box className="review-username">{"Oscar"}</Box>
                <Rating
                  className="review-starts"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Stack>
            </Stack>
          </SwiperSlide>
        </Swiper>
        <Box className={"prev-next-frame"}>
          <ArrowBackRoundedIcon className={"swiper-button-prev"} />

          <div className={"dot-frame-pagination swiper-pagination"}></div>
          <ArrowBackRoundedIcon
            className={"swiper-button-next"}
            style={{ transform: "rotate(-180deg)" }}
          />
        </Box>
      </Stack>
    </div>
  );
}
