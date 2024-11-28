import { FileInterface } from "../types/FileInterface";

export function createFileInput(onChange: (files: File[]) => void, multiply?: boolean, acceptTypes?: string) {
  const input = document.createElement("input");
  input.type = "file";
  input.style.display = "none";
  input.multiple = !!multiply;
  if (acceptTypes) input.accept = acceptTypes;
  document.body.appendChild(input);

  input.addEventListener("change", function () {
    if (input.files!.length === 0) return;
    onChange([...input.files!]);
    input.value = "";
  });

  return {
    open: () => input.click(),
    destroy: () => void (document.body.contains(input) && document.body.removeChild(input)),
  };
}

export function convertFileToFileInterface(file: File): FileInterface {
  return {
    size: file.size,
    path: null!,
    name: file.name,
    rawFile: file,
  };
}
