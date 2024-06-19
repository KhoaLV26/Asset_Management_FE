export function removeExtraWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}

export function removeAllWhitespace(str) {
  return str.replace(/\s+/g, "").trim();
}
export function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
