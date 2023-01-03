const humanizeSize = (bytes) => {
  const thresh = 1000;
  if (bytes < thresh) {
    return `${bytes} B`;
  }
  const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh);
  return `${bytes.toFixed(1)} ${units[u]}`;
};

export { humanizeSize };
