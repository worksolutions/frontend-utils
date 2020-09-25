import { AcceptTypes, makeInputAccept } from "./inputAccept";

import { FileInterface } from "../types/FileInterface";

export function createFileInput(multiply?: boolean, acceptTypes?: AcceptTypes[]) {
  const input = document.createElement("input");
  input.type = "file";
  input.style.display = "none";
  input.multiple = !!multiply;
  if (acceptTypes) input.accept = makeInputAccept(acceptTypes);
  document.body.appendChild(input);
  return {
    open: (onChange: (files: File[]) => void) => {
      const listener = () => {
        if (input.files!.length === 0) return;
        onChange([...input.files!]);
        input.removeEventListener("change", listener); // TODO: переписать, так как можно просто закрыть диалог и эта функция не вызовется
      };
      input.addEventListener("change", listener);
      input.click();
    },
    destroy: () => {
      document.body.removeChild(input);
    },
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
