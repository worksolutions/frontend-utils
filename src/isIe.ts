export default function detectIE() {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    return true;
  }

  const trident = ua.indexOf("Trident/");
  if (trident > 0) {
    return true;
  }

  return false;
}
