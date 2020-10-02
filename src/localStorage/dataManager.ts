import { compose, curry } from "ramda";

export interface DataManagerInterface {
  setData: (key: string, elements: any[]) => void;
  getData: (key: string) => any;
}

export class DataManager {
  private inner: DataManagerInterface;

  constructor(inner: DataManagerInterface) {
    this.inner = inner;
  }

  setData = (keyName: string, elements: any[]) => {
    return this.inner.setData(keyName, elements);
  };

  getData = (name: string) => {
    return this.inner.getData(name);
  };

  map = (key: string, cb: (value: any) => any): void => {
    compose(curry(this.inner.setData)(key), cb, this.inner.getData)(key);
  };
}
