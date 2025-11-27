"use client";

import {
  Stack,
  Typography,
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";

// COMMENT: time slot list to render buttons
const TIME_SLOTS: string[] = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 - 1 PM Lunch Time",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
];

const SERVICE_OPTIONS = [
  "Classic Haircut",
  "Fade & Taper",
  "Beard Trim",
  "Haircut + Beard",
  "Kids Haircut",
];

const BARBER_OPTIONS = ["Oscar", "Michael", "Daniel", "Lucas", "Ethan"];

const Appointment: NextPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<string | null>("3:30 PM");

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);

  return (
    <Stack className="appointment-page">
      <Typography className="hero-title">Appointment</Typography>
      <Stack className="container">
        <Stack className="appoint-main">
          <Stack className="reservation">
            <Typography className="appoint-title">
              Make Your Cropper Reservation
            </Typography>
            <Typography className="appoint-subtitle">
              Step into an elevated grooming experience tailored just for you.
              Our master barbers await to craft your signature look.
            </Typography>
            <Stack className="inputs-main">
              <Box className="appointment-frame">
                <Stack
                  className="service-barber-section"
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: 4, md: 6 }}
                >
                  {/* 01. Select Service */}
                  <Box className="step-block">
                    <Typography className="step-title">
                      01. Select Service
                    </Typography>

                    <Autocomplete
                      className="autocomplete-input"
                      options={SERVICE_OPTIONS}
                      value={selectedService}
                      onChange={(_, value) => setSelectedService(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Choose a service"
                        />
                      )}
                    />
                  </Box>

                  {/* 02. Select Barber */}
                  <Box className="step-block">
                    <Typography className="step-title">
                      02. Select Barber
                    </Typography>

                    <Autocomplete
                      className="autocomplete-input"
                      options={BARBER_OPTIONS}
                      value={selectedBarber}
                      onChange={(_, value) => setSelectedBarber(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Choose a barber"
                        />
                      )}
                    />
                  </Box>
                </Stack>
                {/* COMMENT: top: date + time */}
                <Stack
                  className="appointment-top"
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: 4, md: 10 }}
                >
                  {/* 03. Select Date */}
                  <Box className="date-section">
                    <Typography className="step-title">
                      03. Select Date
                    </Typography>

                    {/* COMMENT: real active browser calendar */}
                    <TextField
                      className="date-input"
                      type="date"
                      variant="outlined"
                      fullWidth
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>

                  {/* 04. Select Time */}
                  <Box className="time-section">
                    <Typography className="step-title">
                      04. Select Time
                    </Typography>

                    <Box className="time-grid">
                      {TIME_SLOTS.map((slot) => (
                        <Button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          variant={
                            selectedTime === slot ? "contained" : "outlined"
                          }
                          className={
                            selectedTime === slot
                              ? "time-chip time-chip--selected"
                              : "time-chip"
                          }
                        >
                          {slot}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                </Stack>

                {/* 05. Personal Information */}
                <Box className="personal-section">
                  <Typography className="step-title">
                    05. Personal Information
                  </Typography>

                  <Stack
                    className="personal-input-row"
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 4, md: 6 }}
                  >
                    <TextField
                      variant="standard"
                      label="Your Name"
                      fullWidth
                      className="personal-input"
                    />
                    <TextField
                      variant="standard"
                      label="Phone Number"
                      fullWidth
                      className="personal-input"
                    />
                    <TextField
                      variant="standard"
                      label="Email Address"
                      fullWidth
                      className="personal-input"
                    />
                  </Stack>

                  <FormControlLabel
                    className="policy-check"
                    control={<Checkbox className="policy-checkbox" />}
                    label="I agree to Cropper’s cancellation/no-show policy and late arrival terms."
                  />
                </Box>

                {/* TOTAL + button */}
                <Stack
                  className="total-row"
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={{ xs: 4, md: 0 }}
                >
                  <Box className="total-box">
                    <Typography className="total-label">TOTAL</Typography>
                    <Typography className="total-value">$45.00</Typography>
                  </Box>

                  <Button
                    className="submit-button"
                    variant="contained"
                    size="large"
                  >
                    MAKE AN APPOINTMENT
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Appointment);
