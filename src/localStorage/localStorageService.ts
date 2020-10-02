import { DataManagerInterface } from "./dataManager";

export class LocalStorageService implements DataManagerInterface {
  setData = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  getData = (key: string) => {
    const gotData = localStorage.getItem(key);
    if (gotData === null || gotData === undefined) return null;
    return JSON.parse(gotData);
  };
}
