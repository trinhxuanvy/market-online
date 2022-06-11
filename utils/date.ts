import moment from "moment";

const formats = [moment.ISO_8601, "MM/DD/YYYY  :)  HH*mm*ss"];

export const isDate = (value): boolean => {
  return moment(value, formats, true).isValid();
};
