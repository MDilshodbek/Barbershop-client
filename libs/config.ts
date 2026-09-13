import i18next from "i18next";

export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
  get error1() { return i18next.t("Something went wrong!"); },
  get error2() { return i18next.t("Please login first!"); },
  get error3() { return i18next.t("Please fulfill all inputs!"); },
  get error4() { return i18next.t("Message is empty!"); },
  get error5() { return i18next.t("Only images with jpeg, jpg, png format allowed!"); },
};

export const formatSlotFromDate = (dateInput: string | Date): string | null => {
  if (!dateInput) return null;
  const dateObj = new Date(dateInput);
  if (Number.isNaN(dateObj.getTime())) return null;

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const hourStr = hours.toString().padStart(2, "0");
  const minuteStr = minutes.toString().padStart(2, "0");

  return `${hourStr}:${minuteStr} ${meridiem}`;
};
