const thresh = 1024;

export function convertBytesToHumanReadableFormat(bytes: number, units: string[]) {
  if (bytes < thresh) return bytes + " " + units[0];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh && u + 1 < units.length - 1);
  return bytes.toFixed(1) + " " + units[u + 1];
}
