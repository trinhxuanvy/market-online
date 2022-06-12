import moment from "moment";

const formats = [moment.ISO_8601, "MM/DD/YYYY  :)  HH*mm*ss"];

export const isDate = (value): boolean => {
  return moment(value, formats, true).isValid();
};

export const checkExpiredDate5Minutes = (date: number): boolean => {
  return date * 1000 - new Date().getTime() > 300000;
};
