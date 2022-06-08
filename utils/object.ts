export const isObjEmpty = (obj) => {
  if (typeof obj === "undefined") return true;

  return Object.keys(obj).length === 0;
};
