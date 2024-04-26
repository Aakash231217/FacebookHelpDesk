import { toast } from "react-toastify";
import { resetApiHeaders } from "../Api/Axios";

export const showSuccess = (message) => {
  toast.success(message || "Success", {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const showError = (message) => {
  toast.error(message || "Something went wrong", {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const getTime = (timeStamp) => {
  const date = new Date(timeStamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return formattedHours + ":" + formattedMinutes + " " + ampm;
};

export const getDate = (timeStamp) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(timeStamp);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}`;
};

export const getDuration = (timestamp) => {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const secondsDiff = Math.floor(diff / 1000);

  if (secondsDiff < 60) {
    return `${secondsDiff}s`;
  } else if (secondsDiff < 3600) {
    return `${Math.floor(secondsDiff / 60)}m`;
  } else {
    return `${Math.floor(secondsDiff / 3600)}h`;
  }
};
