import { Box, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Journal = () => {
  return (
    <Stack className="journal">
      <Stack className="container">
        <Stack className="grooming-blog">The Grooming Blogs</Stack>
        <Stack className="blog-cards">
          <Stack className="journal-card">
            <Stack className="journal-category">
              <Box className="journal-category-title">Cut & Style Guide</Box>
            </Stack>
            <Stack className="journal-title">
              From Taper to Fade: A Journey Through Men's Cuts
            </Stack>
            <Stack className="journal-info">
              <Stack className="journal-date">
                <CalendarMonthIcon />
              </Stack>
              <Stack className="journal-comment">
                <CommentIcon />
              </Stack>
              <Stack className="journal-view">
                <VisibilityIcon />
              </Stack>
            </Stack>
          </Stack>
          <Stack className="journal-card">
            <Stack className="journal-category">
              <Box className="journal-category-title">Cut & Style Guide</Box>
            </Stack>
            <Stack className="journal-title">
              From Taper to Fade: A Journey Through Men's Cuts
            </Stack>
            <Stack className="journal-info">
              <Stack className="journal-date">
                <CalendarMonthIcon />
              </Stack>
              <Stack className="journal-comment">
                <CommentIcon />
              </Stack>
              <Stack className="journal-view">
                <VisibilityIcon />
              </Stack>
            </Stack>
          </Stack>
          <Stack className="journal-card">
            <Stack className="journal-category">
              <Box className="journal-category-title">Cut & Style Guide</Box>
            </Stack>
            <Stack className="journal-title">
              From Taper to Fade: A Journey Through Men's Cuts
            </Stack>
            <Stack className="journal-info">
              <Stack className="journal-date">
                <CalendarMonthIcon />
              </Stack>
              <Stack className="journal-comment">
                <CommentIcon />
              </Stack>
              <Stack className="journal-view">
                <VisibilityIcon />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Journal;
