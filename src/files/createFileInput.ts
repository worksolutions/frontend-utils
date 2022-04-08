import { AcceptTypes, makeInputAccept } from "./inputAccept";

import { FileInterface } from "../types/FileInterface";

export function createFileInput(onChange: (files: File[]) => void, multiply?: boolean, acceptTypes?: AcceptTypes[]) {
  const input = document.createElement("input");
  input.type = "file";
  input.style.display = "none";
  input.multiple = !!multiply;
  if (acceptTypes) input.accept = makeInputAccept(acceptTypes);
  document.body.appendChild(input);

  input.addEventListener("change", function () {
    if (input.files!.length === 0) return;
    onChange([...input.files!]);
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
