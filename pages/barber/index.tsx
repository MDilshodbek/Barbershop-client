import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Barber: NextPage = () => {
  return (
    <Stack className="barber-page">
      <Typography className="hero-title">Masters</Typography>
      <Stack className="container">
        <Stack className="barber-main">
          <Stack className="barber-main-title">Our Artistic Specialists</Stack>
          <Stack className={"filter"}>
            <Box component={"div"} className={"left"}>
              <input
                type="text"
                placeholder={"Search for an agent"}
                value={"searchText"}
                // onChange={(e: any) => setSearchText(e.target.value)}
                // onKeyDown={(event: any) => {
                //   if (event.key == "Enter") {
                //     setSearchFilter({
                //       ...searchFilter,
                //       search: { ...searchFilter.search, text: searchText },
                //     });
                //   }
                // }}
              />
            </Box>
            <Box component={"div"} className={"right"}>
              <span>Sort by</span>
              <div>
                <Button
                // onClick={sortingClickHandler}
                // endIcon={<KeyboardArrowDownRoundedIcon />}
                >
                  {"filterSortName"}
                </Button>
                <Menu
                  // anchorEl={anchorEl}
                  open={false}
                  // onClose={sortingCloseHandler}
                  sx={{ paddingTop: "5px" }}
                >
                  <MenuItem
                    // onClick={sortingHandler}
                    id={"recent"}
                    disableRipple
                  >
                    Recent
                  </MenuItem>
                  <MenuItem
                    // onClick={sortingHandler}
                    id={"old"}
                    disableRipple
                  >
                    Oldest
                  </MenuItem>
                  <MenuItem
                    // onClick={sortingHandler}
                    id={"likes"}
                    disableRipple
                  >
                    Likes
                  </MenuItem>
                  <MenuItem
                    // onClick={sortingHandler}
                    id={"views"}
                    disableRipple
                  >
                    Views
                  </MenuItem>
                </Menu>
              </div>
            </Box>
          </Stack>
          <Stack className="barber-box">
            <Stack className="barber-info">
              <Box className="barber-img">
                <img src="/img/barber1.png" alt="" />
              </Box>
              <Box className="barber-name">Dominick Rossi</Box>
              <Stack className="barber-media">
                <Box className="barber-like">
                  <IconButton color={"default"}>
                    <FavoriteBorderIcon
                      style={{
                        color: "#004034",
                        fontSize: "20px",
                      }}
                    />
                  </IconButton>
                </Box>
                <Stack className="barber-socialmedia">
                  <FacebookOutlinedIcon
                    style={{ color: "#004034", fontSize: "20px" }}
                  />
                  <InstagramIcon
                    style={{ color: "#004034", fontSize: "20px" }}
                  />
                  <XIcon style={{ color: "#004034", fontSize: "20px" }} />
                </Stack>
                <Box className="barber-view">
                  <IconButton color={"default"}>
                    <RemoveRedEyeIcon
                      style={{
                        color: "#004034",
                        fontSize: "20px",
                      }}
                    />
                  </IconButton>
                </Box>
              </Stack>
            </Stack>
           
          </Stack>
          <Stack className={"pagination"}>
            <Stack className="pagination-box">
              <Stack className="pagination-box">
                <Pagination
                  page={1}
                  // count={Math.ceil(total / searchFilter.limit)}
                  // onChange={paginationChangeHandler}
                  shape="circular"
                  style={{ color: "#004034" }}
                />
              </Stack>
            </Stack>
            <span>Total 8 agents available</span>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Barber);
