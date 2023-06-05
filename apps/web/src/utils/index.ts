export const truncate = (str: string, separator = "...") => {
  return [str.slice(0, 5), str.slice(-3)].join(separator);
};
