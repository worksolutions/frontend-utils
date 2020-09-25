export function linkIsNative(link: string) {
  try {
    const url = new URL(link);
    if (url.hostname === "") return true;
    return document.location.hostname !== url.hostname;
  } catch (e) {
    return false;
  }
}
