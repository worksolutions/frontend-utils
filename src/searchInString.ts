export function searchInString(inString: string, target: string, min = 0): boolean {
  return target.length > min
    ? inString.replace(/ /g, "").toLowerCase().indexOf(target.replace(/ /g, "").toLowerCase()) !== -1
    : true;
}
