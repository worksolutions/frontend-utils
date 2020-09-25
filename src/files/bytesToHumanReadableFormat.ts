const thresh = 1024;

const units = ["кб", "мб", "гб"];

export function convertBytesToHumanReadableFormat(bytes: number) {
  if (bytes < thresh) return bytes + " б";
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + " " + units[u];
}
