export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
  error1: "Something went wrong!",
  error2: "Please login first!",
  error3: "Please fulfill all inputs!",
  error4: "Message is empty!",
  error5: "Only images with jpeg, jpg, png format allowed!",
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
