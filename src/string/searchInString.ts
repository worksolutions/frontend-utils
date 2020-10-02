export default function searchInString(inString: string, target: string, min = 0): boolean {
  return target.length > min ? inString.trim().toLowerCase().indexOf(target.trim().toLowerCase()) !== -1 : true;
}
